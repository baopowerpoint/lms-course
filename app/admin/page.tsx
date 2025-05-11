import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongoose";
import { Order, User } from "@/database";
import { ShoppingCart, Users, CreditCard, TrendingUp } from "lucide-react";

async function getStats() {
  await dbConnect();

  // Get total users
  const totalUsers = await User.countDocuments();

  // Get total orders
  const totalOrders = await Order.countDocuments();

  // Get completed orders
  const completedOrders = await Order.countDocuments({ status: "completed" });

  // Get total revenue from completed orders
  const revenue = await Order.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

  return {
    totalUsers,
    totalOrders,
    completedOrders,
    totalRevenue,
  };
}

export default async function AdminDashboard() {
  const { totalUsers, totalOrders, completedOrders, totalRevenue } =
    await getStats();

  const stats = [
    {
      title: "Tổng người dùng",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Tổng đơn hàng",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
    {
      title: "Đơn hàng hoàn tất",
      value: completedOrders,
      icon: CreditCard,
      color: "bg-green-500",
    },
    {
      title: "Doanh thu",
      value: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(totalRevenue),
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders and active users can be added here */}
      </div>
    </div>
  );
}
