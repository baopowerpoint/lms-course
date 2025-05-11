import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/mongoose";
import { formatPrice, parseStringify } from "@/lib/utils";
import { Order, User } from "@/database";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng | Admin",
  description: "Quản lý đơn hàng trên hệ thống",
};

async function getOrders() {
  await dbConnect();

  // Get all orders and populate the user field to get user details
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("user")
    .lean();

  // Process and return orders with proper typing
  const processedOrders = orders.map((order: any) => ({
    _id: order._id.toString(),
    user: {
      _id: order.user._id.toString(),
      name: order.user.name,
      email: order.user.email,
    },
    items: order.items,
    total: order.total,
    paymentMethod: order.paymentMethod,
    status: order.status,
    transactionId: order.transactionId,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  return {
    success: true,
    data: processedOrders,
  };
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      <AdminOrdersTable orders={orders.data} />
    </div>
  );
}
