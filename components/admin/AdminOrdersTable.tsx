"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { completeOrderAndEnrollUser } from "@/lib/actions/enrollment.action";
import { updateOrderStatus } from "@/lib/actions/order.action";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

interface OrderItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: string[];
  total: number;
  paymentMethod: "bank_transfer" | "momo";
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface AdminOrdersTableProps {
  orders: OrderItem[];
}

export default function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Function to handle order status change
  const handleStatusChange = async (
    orderId: string,
    newStatus: "completed" | "cancelled"
  ) => {
    try {
      setIsUpdating(orderId);

      if (newStatus === "completed") {
        // If completing order, also enroll the user in the courses
        await completeOrderAndEnrollUser(orderId);
        toast.success(
          "Đơn hàng đã được xác nhận và người dùng đã được đăng ký vào khóa học"
        );
      } else {
        // Just update the status for cancelled orders
        await updateOrderStatus(orderId, newStatus);
        toast.success("Đơn hàng đã bị hủy");
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    } finally {
      setIsUpdating(null);
    }
  };

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Đang chờ
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Hoàn tất
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Phương thức</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Không có đơn hàng nào
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  {order._id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {order.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  {order.paymentMethod === "bank_transfer"
                    ? "Chuyển khoản"
                    : "MoMo"}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  {formatDistance(new Date(order.createdAt), new Date(), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {order.status === "pending" && (
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() =>
                          handleStatusChange(order._id, "completed")
                        }
                        disabled={isUpdating === order._id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Xác nhận
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() =>
                          handleStatusChange(order._id, "cancelled")
                        }
                        disabled={isUpdating === order._id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Hủy
                      </Button>
                    </div>
                  )}
                  {order.status !== "pending" && (
                    <div className="text-sm text-gray-500">
                      {order.status === "completed" ? "Đã xác nhận" : "Đã hủy"}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
