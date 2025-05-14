"use client";

import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  Info,
  PiggyBankIcon,
  Sparkles,
  Star,
  KeyIcon,
  ArrowRight
} from "lucide-react";
import { Wallet } from "lucide-react";
import React, { useState } from "react";

type PaymentMethod = "bank_transfer" | "momo" | "physical_code" | null;

interface OrderInfo {
  total: number;
  id?: string;
}

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onPaymentConfirmChange: (isConfirmed: boolean) => void;
  order: OrderInfo;
}

const PaymentMethodSelector = ({
  selected,
  onSelect,
  onPaymentConfirmChange,
  order,
}: PaymentMethodSelectorProps) => {
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Hàm xử lý sự kiện khi checkbox thay đổi
  const handlePaymentConfirmChange = (checked: boolean) => {
    setIsPaymentConfirmed(checked);
    onPaymentConfirmChange(checked);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Alert hướng dẫn thanh toán */}
      <div className="bg-chart-3/20 border-chart-3 border-2 rounded-2xl p-6 shadow-md mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <Star className="w-full h-full text-chart-3" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0 bg-chart-3 text-white p-3 rounded-full h-fit">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2 text-chart-3/90">
              Hướng dẫn thanh toán
            </h4>
            <p className="text-base text-foreground">
              Vui lòng chọn phương thức thanh toán và hoàn tất giao dịch trước
              khi bấm "Hoàn tất đơn hàng".
              <span className="block mt-2 p-2 bg-white/50 rounded-lg border border-chart-3/30">
                <span className="font-bold">Lưu ý:</span> Chỉ{" "}
                <span className="font-bold underline decoration-wavy decoration-chart-3/70">
                  sau khi đã thanh toán
                </span>
                , hãy đánh dấu vào ô xác nhận ở dưới.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Physical Code Option */}
      <div
        className={`rounded-2xl p-5 cursor-pointer transition-transform hover:scale-105 ${
          selected === "physical_code"
            ? "bg-chart-3/10 border-2 border-chart-3 shadow-md"
            : "border-2 border-border hover:border-chart-3/50 bg-white"
        }`}
        onClick={() => onSelect("physical_code")}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              selected === "physical_code"
                ? "bg-chart-3 text-white"
                : "border-2 border-gray-300"
            }`}
          >
            {selected === "physical_code" && (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-chart-3/20 p-2 rounded-full">
              <KeyIcon className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <span className="font-bold text-lg block">
                Mã kích hoạt (Phong bì)
              </span>
              <span className="text-sm text-muted-foreground">
                Nhập mã 10 ký tự từ phong bì bạn đã mua
              </span>
            </div>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-chart-3 text-white ml-auto">
              Mới
            </span>
          </div>
        </div>

        {selected === "physical_code" && (
          <div className="mt-6 pl-4 sm:pl-10 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-chart-3/30 shadow-sm">
              <h3 className="font-semibold text-xl mb-4 text-chart-3 flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                Hướng dẫn sử dụng mã kích hoạt
              </h3>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Nếu bạn đã mua phong bì chứa mã kích hoạt 10 ký tự, bạn có thể dùng nó để mở khóa tất cả các khóa học.
                </p>
                
                <div className="bg-chart-3/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-chart-3">Quy trình kích hoạt:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Mở phong bì và lấy mã 10 ký tự</li>
                    <li>Nhấn nút "Kích hoạt mã" bên dưới</li>
                    <li>Nhập mã và hoàn tất quá trình kích hoạt</li>
                    <li>Sau khi kích hoạt thành công, bạn sẽ có quyền truy cập vào tất cả khóa học</li>
                  </ol>
                </div>
                
                <div className="flex justify-center">
                  <a href="/subscription/redeem" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-chart-3 text-white hover:bg-chart-3/90 transition-colors">
                    <span>Kích hoạt mã của bạn</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bank Transfer Option */}
      <div
        className={`rounded-2xl p-5 cursor-pointer transition-transform hover:scale-105 ${
          selected === "bank_transfer"
            ? "bg-primary/10 border-2 border-primary shadow-md"
            : "border-2 border-border hover:border-primary/50 bg-white"
        }`}
        onClick={() => onSelect("bank_transfer")}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              selected === "bank_transfer"
                ? "bg-primary text-white"
                : "border-2 border-gray-300"
            }`}
          >
            {selected === "bank_transfer" && (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-accent p-2 rounded-full">
              <PiggyBankIcon className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg block">
                Chuyển khoản ngân hàng
              </span>
              <span className="text-sm text-muted-foreground">
                Chuyển tiền qua tài khoản ngân hàng
              </span>
            </div>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-primary text-primary-foreground ml-auto">
              Khuyên dùng
            </span>
          </div>
        </div>

        {selected === "bank_transfer" && (
          <div className="mt-6 pl-4 sm:pl-10 space-y-6">
            {/* Bảng thông tin thanh toán */}
            <div className="bg-white shadow-md p-5 relative border border-accent">
              <div className="absolute top-0 right-0 transform -translate-y-1/3 translate-x-1/4">
                <div className="bg-primary text-white text-xs font-bold py-1 px-3 rounded-lg shadow-md transform rotate-12">
                  Vui lòng chuyển khoản trước
                </div>
              </div>

              <h3 className="font-bold text-xl mb-4 text-blue-500 flex items-center gap-2">
                <PiggyBankIcon className="w-6 h-6" />
                Thông tin chuyển khoản
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-500 font-medium mb-1">
                      Ngân hàng:
                    </p>
                    <p className="font-bold text-lg">MB BANK</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-500 font-medium mb-1">
                      Số tài khoản:
                    </p>
                    <p className="font-bold text-lg">8269920228888</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-accent">
                  <p className="text-sm text-accent-foreground font-medium mb-1">
                    Chủ tài khoản:
                  </p>
                  <p className="font-bold text-lg">TRAN THI THOA</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-accent">
                    <p className="text-sm text-accent-foreground font-medium mb-1">
                      Chi nhánh:
                    </p>
                    <p className="font-bold">Hồ Chí Minh</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-accent/50">
                    <p className="text-sm text-accent-foreground font-medium mb-1">
                      Số tiền:
                    </p>
                    <p className="font-bold text-destructive">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-accent/30">
                  <p className="text-sm text-accent-foreground font-bold mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-accent-foreground" />
                    Nội dung chuyển khoản (quan trọng):
                  </p>
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-chart-5 font-bold break-words text-center text-lg">
                    Thanh toan khoa hoc {`<email>`}
                  </div>
                  <p className="text-sm text-accent-foreground mt-2 italic text-center">
                    Thay {`<email>`} bằng địa chỉ email của bạn
                  </p>
                </div>
              </div>
            </div>

            {/* Quy trình xác nhận */}
            <div className="bg-white shadow-md p-5 relative border border-primary">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-10">
                <Star className="w-full h-full text-primary" />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Quy trình xác nhận thanh toán
                </h3>

                <div className="space-y-3 mt-2">
                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
                    <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <p className="font-semibold">
                      Chuyển khoản theo thông tin bên trên
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
                    <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <p className="font-semibold">
                      Chụp ảnh hoặc lưu biên lai chuyển khoản
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
                    <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <p className="font-semibold">
                      Đánh dấu vào ô xác nhận đã thanh toán bên dưới
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
                    <div className="bg-primary text-white rounded-full h-7 w-7 flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <p className="font-semibold">
                      Nhấn nút "Hoàn tất đơn hàng"
                    </p>
                  </div>
                </div>

                <div className="bg-chart-3/10 p-3 rounded-xl mt-2 border border-chart-3/30">
                  <p className="font-semibold flex items-center">
                    <Star className="w-5 h-5 text-chart-3 mr-2 flex-shrink-0" />
                    Sau khi xác nhận thanh toán, chúng tôi sẽ kích hoạt khóa học
                    trong vòng 24 giờ làm việc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MoMo Option */}
      <div
        className={`rounded-2xl p-5 cursor-pointer transition-transform hover:scale-105 ${
          selected === "momo"
            ? "bg-chart-5/10 border-2 border-chart-5 shadow-md"
            : "border-2 border-border hover:border-chart-5/50 bg-white"
        }`}
        onClick={() => onSelect("momo")}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              selected === "momo"
                ? "bg-chart-5 text-white"
                : "border-2 border-gray-300"
            }`}
          >
            {selected === "momo" && <CheckCircle2 className="w-4 h-4" />}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-chart-5/20 p-2 rounded-full">
              <Wallet className="w-6 h-6 text-chart-5" />
            </div>
            <div>
              <span className="font-bold text-lg block">MoMo</span>
              <span className="text-sm text-muted-foreground">
                Thanh toán qua ví điện tử MoMo
              </span>
            </div>
          </div>
        </div>

        {selected === "momo" && (
          <div className="mt-6 pl-4 sm:pl-10 space-y-6">
            {/* Bảng thông tin thanh toán MoMo */}
            <div className="bg-chart-5/10 rounded-2xl p-5 border-2 border-chart-5 shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 transform -translate-y-1/3 translate-x-1/4">
                <div className="bg-chart-5 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-md transform rotate-12">
                  Vui lòng thanh toán trước
                </div>
              </div>

              <h3 className="font-bold text-xl mb-4 text-chart-5 flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Thông tin thanh toán MoMo
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-chart-5">
                    <p className="text-sm text-chart-5 font-medium mb-1">
                      Số điện thoại MoMo:
                    </p>
                    <p className="font-bold text-lg">0987654321</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-chart-5">
                    <p className="text-sm text-chart-5 font-medium mb-1">
                      Tên tài khoản:
                    </p>
                    <p className="font-bold text-lg">NGUYEN VAN A</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-chart-5/50">
                  <p className="text-sm text-chart-5 font-medium mb-1">
                    Số tiền:
                  </p>
                  <p className="font-bold text-destructive">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-chart-5/30">
                  <p className="text-sm text-chart-5 font-bold mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-chart-5" />
                    Nội dung chuyển tiền (quan trọng):
                  </p>
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-chart-5 font-bold break-words text-center text-lg">
                    Thanh toan khoa hoc {`<email>`}
                  </div>
                  <p className="text-sm text-chart-5 mt-2 italic text-center">
                    Thay {`<email>`} bằng địa chỉ email của bạn
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-white p-4 rounded-xl border border-chart-5/30 flex items-start gap-3">
                <div className="bg-chart-3 text-white p-2 rounded-full h-fit">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-sm">
                  <span className="font-bold">Tip:</span> Khi quét mã QR hoặc
                  thanh toán qua MoMo, hãy nhấn vào nút "Gởi tới bạn bè" và nhập
                  số điện thoại bên trên.
                </p>
              </div>
            </div>

            {/* Hướng dẫn sử dụng MoMo */}
            <div className="bg-white rounded-2xl p-5 border-2 border-chart-5 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-chart-5 mb-3">
                Ðược phát triển bởi
              </h3>
              <div className="flex justify-center items-center py-6 px-4 bg-chart-5/5 rounded-xl border border-chart-5/20">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-chart-5">
                    MoMo
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ví điện tử hàng đầu Việt Nam
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Xác nhận đã thanh toán */}
      {selected && (
        <div className="mt-10 mb-4 relative">
          {/* Dòng kết nối */}
          <div className="absolute left-10 -top-6 h-6 w-0.5 bg-primary z-10"></div>

          {/* Khối xác nhận */}
          <div className="rounded-2xl p-6 border-2 border-primary bg-white shadow-lg relative overflow-hidden transition-shadow">
            {/* Background elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 opacity-5">
              <Star className="w-full h-full text-primary" />
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
              <Star className="w-full h-full text-primary" />
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 rounded-full p-3">
                  <CheckCircle2
                    className={`w-8 h-8 ${isPaymentConfirmed ? "text-primary" : "text-gray-300"} transition-colors duration-300`}
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-primary">
                  Xác nhận thanh toán
                </h3>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="payment-confirmed"
                      checked={isPaymentConfirmed}
                      onChange={(e) =>
                        handlePaymentConfirmChange(e.target.checked)
                      }
                      className="h-5 w-5 text-primary border-primary rounded focus:ring-primary cursor-pointer"
                    />
                    <label
                      htmlFor="payment-confirmed"
                      className="font-bold text-lg cursor-pointer text-primary"
                    >
                      Tôi đã hoàn tất thanh toán
                    </label>
                  </div>

                  <p className="text-base ml-8">
                    Tôi xác nhận đã thanh toán đầy đủ số tiền theo hướng dẫn và
                    hiểu rằng khóa học sẽ được kích hoạt sau khi đơn vị xác nhận
                    thanh toán thành công.
                  </p>
                </div>

                {isPaymentConfirmed ? (
                  <div className="bg-chart-3/10 p-3 rounded-xl border border-chart-3 flex items-center gap-3 animate-pulse">
                    <Sparkles className="w-6 h-6 text-chart-3 flex-shrink-0" />
                    <p className="font-semibold text-foreground">
                      Tuyệt vời! Bạn đã sẵn sàng để hoàn tất đơn hàng.
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted p-3 rounded-xl flex items-center gap-3">
                    <Info className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Vui lòng xác nhận sau khi đã hoàn tất thanh toán.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
