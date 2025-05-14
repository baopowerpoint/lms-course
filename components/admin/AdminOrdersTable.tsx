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
import { XCircle } from "lucide-react";
import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/order.action";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import AdminOrderConfirmation from "./AdminOrderConfirmation";

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

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      setIsUpdating(orderId);
      
      // Update the status to cancelled
      await updateOrderStatus(orderId, "cancelled");
      toast.success("Đơn hàng đã bị hủy");
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setIsUpdating(null);
    }
  };
  
  // Function to handle successful confirmation
  const handleConfirmationSuccess = () => {
    // Refresh the page to show updated status
    window.location.reload();
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
                    <div className="flex gap-2">
                      <AdminOrderConfirmation
                        orderId={order._id}
                        paymentMethod={order.paymentMethod}
                        disabled={isUpdating === order._id}
                        onSuccess={handleConfirmationSuccess}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isUpdating === order._id}
                        onClick={() => handleCancelOrder(order._id)}
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
