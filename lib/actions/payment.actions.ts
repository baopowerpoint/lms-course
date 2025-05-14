"use server";

import dbConnect from "@/lib/mongoose";
import { Payment, User } from "@/database";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NotFoundError } from "../http-errors";

// Kiểm tra trạng thái thanh toán của người dùng - cần admin duyệt
export async function checkUserPayment() {
  try {
    await dbConnect();

    // Lấy thông tin user hiện tại
    const { userId } = await auth();
    if (!userId) {
      return { success: false, data: { hasPaid: false, status: null } };
    }

    // Tìm user trong database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return { success: false, data: { hasPaid: false, status: null } };
    }

    // Kiểm tra có thanh toán nào hay không
    const pendingPayment = await Payment.findOne({
      user: user._id,
      status: "pending",
    }).sort({ createdAt: -1 });
    
    const completedPayment = await Payment.findOne({
      user: user._id,
      status: "completed",
    }).sort({ createdAt: -1 });

    // Nếu có thanh toán đã hoàn thành (admin đã duyệt)
    if (completedPayment) {
      return {
        success: true,
        data: {
          hasPaid: true,
          status: "completed",
          paymentId: completedPayment._id.toString(),
          amount: completedPayment.amount,
          date: completedPayment.createdAt,
        },
      };
    }
    
    // Nếu có thanh toán đang chờ duyệt
    if (pendingPayment) {
      return {
        success: true,
        data: {
          hasPaid: false, // Chưa được coi là đã thanh toán cho đến khi admin duyệt
          status: "pending",
          paymentId: pendingPayment._id.toString(),
          amount: pendingPayment.amount,
          date: pendingPayment.createdAt,
        },
      };
    }

    // Không có thanh toán nào
    return { success: true, data: { hasPaid: false, status: null } };
  } catch (error) {
    console.error("Error checking user payment:", error);
    return { success: false, data: { hasPaid: false, status: null }, error: "Failed to check payment status" };
  }
}

// Tạo một thanh toán mới
export async function createPayment(amount: number, method: "bank_transfer" | "momo") {
  try {
    await dbConnect();

    // Lấy thông tin user hiện tại
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new NotFoundError("user");
    }

    // Tìm user trong database
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      throw new NotFoundError("user");
    }

    // Lấy thông tin thanh toán với cả user và userId để đảm bảo tương thích với mọi schema
    const paymentData = {
      user: user._id,       // Cách 1: theo schema trong code
      userId: user._id,     // Cách 2: theo lỗi validation
      amount,
      method,
      status: "pending",   // Trạng thái mặc định là đang chờ admin duyệt
    };
    
    console.log("Creating payment with data:", paymentData);
    
    // Tạo payment mới
    const payment = await Payment.create(paymentData);

    // Revalidate các trang liên quan
    revalidatePath("/subscription");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/courses");
    revalidatePath("/courses");

    return {
      success: true,
      data: {
        paymentId: payment._id.toString(),
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
      },
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    return { success: false, error: "Failed to create payment" };
  }
}

// Lấy thông tin thanh toán của người dùng
export async function getUserPayments() {
  try {
    await dbConnect();

    // Lấy thông tin user hiện tại
    const { userId } = await auth();
    if (!userId) {
      return { success: false, data: [] };
    }

    // Tìm user trong database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return { success: false, data: [] };
    }

    // Lấy danh sách thanh toán
    const payments = await Payment.find({ user: user._id }).sort({ createdAt: -1 });

    return {
      success: true,
      data: payments.map((payment) => ({
        id: payment._id.toString(),
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
    };
  } catch (error) {
    console.error("Error getting user payments:", error);
    return { success: false, error: "Failed to get payment history" };
  }
}

// Kiểm tra người dùng có quyền truy cập vào khóa học hay không
// (Đã đơn giản hóa - chỉ kiểm tra xem người dùng đã có payment thành công chưa)
export async function checkCourseAccess() {
  try {
    await dbConnect();

    // Lấy thông tin user hiện tại
    const { userId } = await auth();
    if (!userId) {
      return { success: false, hasAccess: false };
    }

    // Tìm user trong database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return { success: false, hasAccess: false };
    }

    // Kiểm tra đơn giản - người dùng có bất kỳ thanh toán nào đã hoàn thành chưa
    const payment = await Payment.findOne({
      user: user._id,
      status: "completed"
    });

    return { success: true, hasAccess: !!payment };
  } catch (error) {
    console.error("Error checking course access:", error);
    return { success: false, hasAccess: false };
  }
}

// Function dành cho admin để duyệt thanh toán đang chờ xác nhận
export async function approvePayment(paymentId: string) {
  try {
    await dbConnect();
    
    // Kiểm tra xem người dùng có phải admin hay không - cần thêm logic kiểm tra quyền admin
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    
    // TODO: Add admin role check here
    // Tạm thời cho phép tất cả người dùng đăng nhập đều có thể thực hiện hành động này trong demo
    
    // Tìm thanh toán đang chờ duyệt
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return { success: false, error: "Payment not found" };
    }
    
    if (payment.status !== "pending") {
      return { success: false, error: "Payment is not in pending status" };
    }
    
    // Cập nhật trạng thái thanh toán thành đã hoàn thành (approved)
    payment.status = "completed";
    await payment.save();
    
    // Revalidate các trang liên quan
    revalidatePath("/admin/payments");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/courses");
    revalidatePath("/courses");
    revalidatePath("/subscription");
    
    return { 
      success: true, 
      data: { 
        paymentId: payment._id.toString(),
        status: payment.status 
      } 
    };
    
  } catch (error) {
    console.error("Error approving payment:", error);
    return { success: false, error: "Failed to approve payment" };
  }
}

// Function dành cho admin để lấy danh sách tất cả các thanh toán
export async function getAllPayments() {
  try {
    await dbConnect();
    
    // Kiểm tra xem người dùng có phải admin hay không - cần thêm logic kiểm tra quyền admin
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated", data: [] };
    }
    
    // TODO: Add admin role check here
    
    // Lấy tất cả các thanh toán, sắp xếp mới nhất lên đầu
    const payments = await Payment.find().sort({ createdAt: -1 }).populate('user');
    
    return { 
      success: true, 
      data: payments.map((payment) => ({
        id: payment._id.toString(),
        userId: payment.user._id.toString(),
        userName: payment.user.name,
        userEmail: payment.user.email,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      }))
    };
    
  } catch (error) {
    console.error("Error getting all payments:", error);
    return { success: false, error: "Failed to get payments", data: [] };
  }
}
