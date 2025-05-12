"use client";

import Image from "next/image";
import Duolingo from "@/components/ui/duolingo-button";

export const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl animate-fadeIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slideInLeft">
            Học toán thật
            <span className="text-emerald-500 animate-pulse"> vui vẻ </span>và
            <span className="text-primary animate-pulse delay-300">
              {" "}
              hiệu quả
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-slideInLeft delay-150">
            Khám phá cách học toán mới với phương pháp học tập tương tác và cá
            nhân hoá, giúp bạn tiến bộ mỗi ngày chỉ với 15 phút.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slideInLeft delay-300">
            <Duolingo className="">BẮT ĐẦU MIỄN PHÍ</Duolingo>
          </div>
          <div className="mt-10 flex items-center space-x-6 animate-fadeIn delay-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden transform hover:scale-110 transition-transform duration-200 hover:z-10 relative delay-${i}`}
                >
                  <span className="text-xs font-medium">HV</span>
                </div>
              ))}
            </div>
            <div className="group">
              <div className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 text-yellow-400 transform transition-transform duration-300 group-hover:rotate-12 delay-${star}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-primary">4.9/5</span> từ hơn{" "}
                <span className="font-bold animate-pulse">10,000</span> học viên
              </p>
            </div>
          </div>
        </div>
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden hidden md:block animate-floatUp shadow-xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-100 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-primary/30 rounded-full animate-pulse opacity-70 delay-300"></div>
          <Image
            src={"/hero.svg"}
            alt="hero"
            width={500}
            height={500}
            className="z-10 relative animate-fadeIn delay-300"
          />
        </div>
      </div>
    </section>
  );
};
