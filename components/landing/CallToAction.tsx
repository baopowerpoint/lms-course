"use client";

import { Button } from "@/components/ui/button";
import Duolingo from "../ui/duolingo-button";

export const CallToAction = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto relative overflow-hidden transform hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0 animate-pulse"></div>
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl z-0 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl z-0 animate-ping opacity-70 delay-500"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-emerald-200 transition-colors duration-300 group cursor-pointer shadow-md hover:shadow-lg">
              <span className="text-5xl transform group-hover:-translate-y-2 transition-transform duration-300 group-hover:scale-110">🚀</span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sẵn sàng bắt đầu hành trình học toán?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl">
                Tham gia cùng hơn 10,000 học viên đang học toán mỗi ngày với
                Havamath. Đăng ký miễn phí và trải nghiệm phương pháp học toán
                hiệu quả.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Duolingo className="rounded-full text-base font-medium transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-bounce-subtle">
                  Bắt đầu ngay - Miễn phí
                </Duolingo>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
