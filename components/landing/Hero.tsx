"use client";

import { Button } from "@/components/ui/button";
import { createUser, tryConnect } from "@/lib/actions/user.action";

export const Hero = () => {
  async function testConnect() {
    await createUser({
        clerkId: "clerkId",
        username: 'baopowerpoint',
        name: "powerpoi",
        email: "baopowerpoint@gmail.com",
        picture: ""
    })
  }
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Học toán thật<span className="text-emerald-500"> vui vẻ </span>và
            <span className="text-primary"> hiệu quả</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Khám phá cách học toán mới với phương pháp học tập tương tác và cá
            nhân hoá, giúp bạn tiến bộ mỗi ngày chỉ với 15 phút.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={testConnect}
              size="lg"
              className="rounded-full text-lg font-medium px-8 py-6 h-auto"
            >
              Bắt đầu miễn phí
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-lg font-medium px-8 py-6 h-auto"
            >
              Xem demo
            </Button>
          </div>
          <div className="mt-10 flex items-center space-x-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                >
                  <span className="text-xs font-medium">HV</span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">4.9/5</span> từ hơn 10,000 học
                viên
              </p>
            </div>
          </div>
        </div>
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden hidden md:block">
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-primary/20 rounded-full blur-3xl z-0"></div>
          <div className="absolute -left-12 -top-12 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl z-0"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[80%] h-[80%] flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full mb-6 flex items-center justify-center">
                <span className="text-4xl">🦉</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">
                Bắt đầu hành trình học toán
              </h3>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg ${
                      i === 1 ? "bg-primary text-white" : "bg-gray-100"
                    } flex items-center justify-center font-medium`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="mt-6 w-full">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
