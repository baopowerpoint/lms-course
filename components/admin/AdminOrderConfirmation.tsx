"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrderStatus } from "@/lib/actions/order.action";
import { completeOrderAndEnrollUser } from "@/lib/actions/enrollment.action";
import { toast } from "sonner";
import { CheckCircle, Eye } from "lucide-react";

interface AdminOrderConfirmationProps {
  orderId: string;
  paymentMethod: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

export default function AdminOrderConfirmation({
  orderId,
  paymentMethod,
  disabled = false,
  onSuccess,
}: AdminOrderConfirmationProps) {
  const [open, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Cập nhật trạng thái đơn hàng thành "completed" và thêm transactionId
      await updateOrderStatus(orderId, "completed", transactionId);
      
      // Tạo enrollments từ đơn hàng này để học viên có thể truy cập khóa học
      await completeOrderAndEnrollUser(orderId);
      
      toast.success(
        "Xác nhận thanh toán thành công. Học viên đã được đăng ký vào khóa học."
      );
      
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận thanh toán:", error);
      toast.error("Đã xảy ra lỗi khi xác nhận thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 flex gap-2"
          disabled={disabled}
        >
          <CheckCircle className="h-4 w-4" />
          Xác nhận thanh toán
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận thanh toán đơn hàng</DialogTitle>
          <DialogDescription>
            {paymentMethod === "bank_transfer" 
              ? "Vui lòng xác nhận đã nhận được chuyển khoản cho đơn hàng này." 
              : "Vui lòng xác nhận thanh toán MoMo cho đơn hàng này."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transaction" className="text-right">
              Mã giao dịch
            </Label>
            <Input
              id="transaction"
              placeholder="Nhập mã giao dịch"
              className="col-span-3"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Ghi chú
            </Label>
            <Input
              id="notes"
              placeholder="Ghi chú thêm (nếu có)"
              className="col-span-3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!transactionId || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Đang xác nhận..." : "Xác nhận thanh toán"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
