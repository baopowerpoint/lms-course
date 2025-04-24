"use client";

import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl z-0"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-5xl">🚀</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sẵn sàng bắt đầu hành trình học toán?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl">
                Tham gia cùng hơn 10,000 học viên đang học toán mỗi ngày với Havamath. 
                Đăng ký miễn phí và trải nghiệm phương pháp học toán hiệu quả.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-full text-base font-medium">
                  Bắt đầu ngay - Miễn phí
                </Button>
                <Button variant="outline" size="lg" className="rounded-full text-base font-medium">
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
