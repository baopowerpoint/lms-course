import { Suspense } from "react";
import Courses from "@/components/courses/Courses";
import Filter from "@/components/shared/search/filter";
import LocalSearch from "@/components/shared/search/search";
import { Loader2 } from "lucide-react";

const Page = () => {
  return (
    <div>
      <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white ">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-4">
            Khoá học nổi bật
          </h1>
          <p className="text-md font-normal">
            Khám phá các khoá học toán đa dạng từ cơ bản đến nâng cao, được
            thiết
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24 ">
        <div className="container mx-auto px-4 ">
          <div className="">
            <div className="gap-2 flex items-start md:items-center justify-between flex-col md:flex-row">
              <h2 className="font-semibold text-lg">Tất cả khoá học</h2>
              <LocalSearch route="/courses" placeholder="Tìm kiếm khoá học" />
            </div>

            <Suspense fallback={<div className="w-full mt-2 flex"><Loader2 className="animate-spin w-5"/></div>}>
              <Filter />
            </Suspense>
          </div>
          <Suspense fallback={
            <div className="mt-10 flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          }>
            <Courses />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default Page;
