"use client";
import { PiggyBankIcon } from "lucide-react";
import { Wallet } from "lucide-react";
import React from "react";

type PaymentMethod = "bank_transfer" | "momo" | null;

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      {/* Bank Transfer Option */}
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          selected === "bank_transfer"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onSelect("bank_transfer")}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selected === "bank_transfer"
                ? "border-primary"
                : "border-gray-300"
            }`}
          >
            {selected === "bank_transfer" && (
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <PiggyBankIcon className="w-5 h-5 text-gray-700" />
            <span className="font-medium">Chuyển khoản ngân hàng</span>
          </div>
        </div>

        {selected === "bank_transfer" && (
          <div className="mt-4 pl-8">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-medium mb-1">Thông tin chuyển khoản:</p>
              <p className="text-sm mb-1">
                Ngân hàng: <span className="font-medium">Vietcombank</span>
              </p>
              <p className="text-sm mb-1">
                Số tài khoản: <span className="font-medium">1234567890</span>
              </p>
              <p className="text-sm mb-1">
                Chủ tài khoản:{" "}
                <span className="font-medium">CÔNG TY CỔ PHẦN HAVAMATH</span>
              </p>
              <p className="text-sm mb-3">
                Chi nhánh: <span className="font-medium">Hồ Chí Minh</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nội dung chuyển khoản:</span> Ghi
                họ tên và email của bạn
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Sau khi chuyển khoản, chúng tôi sẽ xác nhận và kích hoạt khóa học
              cho bạn trong vòng 24 giờ.
            </p>
          </div>
        )}
      </div>

      {/* MoMo Option */}
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          selected === "momo"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onSelect("momo")}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selected === "momo" ? "border-primary" : "border-gray-300"
            }`}
          >
            {selected === "momo" && (
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-pink-600" />
            <span className="font-medium">MoMo</span>
          </div>
        </div>

        {selected === "momo" && (
          <div className="mt-4 pl-8">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-medium mb-1">Thông tin thanh toán MoMo:</p>
              <p className="text-sm mb-1">
                Số điện thoại: <span className="font-medium">0909 123 456</span>
              </p>
              <p className="text-sm mb-1">
                Tên tài khoản:{" "}
                <span className="font-medium">CÔNG TY CỔ PHẦN HAVAMATH</span>
              </p>
              <p className="text-sm mb-3">
                Nội dung chuyển tiền:{" "}
                <span className="font-medium">Họ tên và email của bạn</span>
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Sau khi thanh toán qua MoMo, chúng tôi sẽ xác nhận và kích hoạt
              khóa học cho bạn trong vòng 24 giờ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
