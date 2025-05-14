"use client";

import { useState, useEffect } from "react";
import { approvePayment, getAllPayments } from "@/lib/actions/payment.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: string;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
}

export default function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setIsLoading(true);
    try {
      const result = await getAllPayments();
      if (result.success && result.data) {
        setPayments(result.data);
      } else {
        toast.error("Không thể tải danh sách thanh toán");
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách thanh toán");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprovePayment(paymentId: string) {
    setProcessingId(paymentId);
    try {
      const result = await approvePayment(paymentId);
      if (result.success) {
        toast.success("Đã duyệt thanh toán thành công");
        loadPayments(); // Reload payments list
      } else {
        toast.error(result.error || "Không thể duyệt thanh toán");
      }
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Đã xảy ra lỗi khi duyệt thanh toán");
    } finally {
      setProcessingId(null);
    }
  }

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Đang chờ duyệt
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
          >
            Đã duyệt
          </Button>
        </div>
        <Button onClick={loadPayments} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Làm mới"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải...</span>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p>Không có thanh toán nào {filter !== "all" ? `(${filter})` : ""}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.userName}</p>
                      <p className="text-sm text-gray-500">{payment.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatAmount(payment.amount)}</TableCell>
                  <TableCell>
                    {payment.method === "bank_transfer"
                      ? "Chuyển khoản ngân hàng"
                      : "MoMo"}
                  </TableCell>
                  <TableCell>
                    {payment.status === "pending" ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Đang chờ duyệt
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Đã duyệt
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    {payment.status === "pending" ? (
                      <Button
                        onClick={() => handleApprovePayment(payment.id)}
                        disabled={processingId === payment.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingId === payment.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Duyệt
                          </>
                        )}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        Đã xử lý
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
