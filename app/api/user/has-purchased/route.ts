import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Order, User } from "@/database";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    // Nếu không có người dùng đăng nhập
    if (!userId) {
      return NextResponse.json({ hasPurchased: false }, { status: 200 });
    }

    await dbConnect();

    // Tìm user trong database bằng clerkId
    const dbUser = await User.findOne({ clerkId: userId }).lean();

    if (!dbUser) {
      return NextResponse.json({ hasPurchased: false }, { status: 200 });
    }

    // Kiểm tra xem người dùng có đơn hàng nào đã hoàn thành không
    const orders = await Order.find({
      user: dbUser._id.toString(),
      status: "completed", // Chỉ đơn hàng đã hoàn thành
    }).lean();

    // Nếu có ít nhất một đơn hàng hoàn thành, người dùng đã mua khóa học
    const hasPurchased = orders && orders.length > 0;

    return NextResponse.json({ hasPurchased });
  } catch (error) {
    console.error("Error checking user purchases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
