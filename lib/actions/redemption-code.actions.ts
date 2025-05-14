"use server";

import dbConnect from "@/lib/mongoose";
import { RedemptionCode, User, Payment } from "@/database";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NotFoundError } from "../http-errors";
import crypto from "crypto";

// Hàm tạo mã ngẫu nhiên 10 ký tự (chữ hoa và số)
export async function generateRandomCode(): Promise<string> {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(
      Math.floor(crypto.randomBytes(1)[0] % charactersLength)
    );
  }

  return result;
}

// Hàm dành cho admin để tạo mã code mới
export async function createRedemptionCode(quantity: number = 1) {
  try {
    await dbConnect();

    // Kiểm tra xem người dùng có phải admin hay không (cần bổ sung logic kiểm tra quyền)
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new NotFoundError("user");
    }

    // Tìm user trong database
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      throw new NotFoundError("user");
    }

    // Tạo mã theo số lượng yêu cầu
    const generatedCodes = [];

    for (let i = 0; i < quantity; i++) {
      // Tạo mã ngẫu nhiên 10 ký tự
      let code = await generateRandomCode();

      // Đảm bảo mã là duy nhất
      let existingCode = await RedemptionCode.findOne({ code });
      while (existingCode) {
        code = await generateRandomCode();
        existingCode = await RedemptionCode.findOne({ code });
      }

      const codeData = {
        code,
        isActive: true,
        isRedeemed: false,
        createdBy: user._id,
      };

      const redemptionCode = await RedemptionCode.create(codeData);

      generatedCodes.push({
        id: redemptionCode._id.toString(),
        code: redemptionCode.code,
      });
    }

    // Revalidate các trang liên quan
    revalidatePath("/admin/codes");

    return {
      success: true,
      data: generatedCodes,
    };
  } catch (error) {
    console.error("Error creating redemption code:", error);
    return { success: false, error: "Failed to create redemption code" };
  }
}

// Hàm cho user sử dụng mã code
export async function redeemCode(code: string) {
  try {
    await dbConnect();

    // Lấy thông tin user hiện tại
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return { success: false, error: "Bạn cần đăng nhập để sử dụng mã" };
    }

    // Tìm user trong database
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return { success: false, error: "Không tìm thấy thông tin người dùng" };
    }

    // Chuẩn hóa mã: chuyển thành chữ hoa và loại bỏ khoảng trắng
    const normalizedCode = code.toUpperCase().trim();

    // Tìm mã code trong database
    const redemptionCode = await RedemptionCode.findOne({
      code: normalizedCode,
    });

    if (!redemptionCode) {
      return { success: false, error: "Mã không hợp lệ hoặc không tồn tại" };
    }

    if (!redemptionCode.isActive) {
      return { success: false, error: "Mã này đã bị vô hiệu hóa" };
    }

    if (redemptionCode.isRedeemed) {
      return { success: false, error: "Mã này đã được sử dụng" };
    }

    if (redemptionCode.expiresAt && new Date() > redemptionCode.expiresAt) {
      return { success: false, error: "Mã này đã hết hạn" };
    }

    // Cập nhật trạng thái của mã
    redemptionCode.isRedeemed = true;
    redemptionCode.redeemedBy = user._id;
    redemptionCode.redeemedAt = new Date();
    await redemptionCode.save();

    // Tạo một payment mới tự động với trạng thái "completed"
    // Không có giá trị cụ thể, chỉ đánh dấu đã thanh toán để mở khóa truy cập
    const paymentData = {
      user: user._id,
      amount: 0, // Không có giá trị cụ thể
      method: "physical_code",
      status: "completed",
      notes: `Kích hoạt bằng mã code: ${normalizedCode}`,
    };

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
      },
    };
  } catch (error) {
    console.error("Error redeeming code:", error);
    return {
      success: false,
      error: "Không thể sử dụng mã. Vui lòng thử lại sau.",
    };
  }
}

// Hàm lấy danh sách tất cả các mã code (dành cho admin)
export async function getAllRedemptionCodes() {
  try {
    await dbConnect();

    // Kiểm tra xem người dùng có phải admin hay không (cần bổ sung logic kiểm tra quyền)
    const { userId } = await auth();
    if (!userId) {
      return { success: false, data: [] };
    }

    // Lấy danh sách mã code và populate thông tin người tạo và người sử dụng
    const codes = await RedemptionCode.find()
      .populate("createdBy", "name email")
      .populate("redeemedBy", "name email")
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: codes.map((code) => ({
        id: code._id.toString(),
        code: code.code,
        isActive: code.isActive,
        isRedeemed: code.isRedeemed,
        redeemedBy: code.redeemedBy
          ? {
              id: code.redeemedBy._id.toString(),
              name: code.redeemedBy.name,
              email: code.redeemedBy.email,
            }
          : null,
        redeemedAt: code.redeemedAt,
        createdBy: code.createdBy
          ? {
              id: code.createdBy._id.toString(),
              name: code.createdBy.name,
              email: code.createdBy.email,
            }
          : null,
        expiresAt: code.expiresAt,

        createdAt: code.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error getting redemption codes:", error);
    return { success: false, error: "Failed to get redemption codes" };
  }
}

// Hàm deactivate một mã code (dành cho admin)
export async function deactivateRedemptionCode(codeId: string) {
  try {
    await dbConnect();

    // Kiểm tra xem người dùng có phải admin hay không (cần bổ sung logic kiểm tra quyền)
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Tìm và cập nhật trạng thái mã code
    const code = await RedemptionCode.findByIdAndUpdate(
      codeId,
      { isActive: false },
      { new: true }
    );

    if (!code) {
      return { success: false, error: "Không tìm thấy mã" };
    }

    // Revalidate các trang liên quan
    revalidatePath("/admin/codes");

    return {
      success: true,
      data: {
        id: code._id.toString(),
        code: code.code,
        isActive: code.isActive,
      },
    };
  } catch (error) {
    console.error("Error deactivating redemption code:", error);
    return { success: false, error: "Failed to deactivate redemption code" };
  }
}
