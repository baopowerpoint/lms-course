import Filter from "@/components/shared/search/filter";
import LocalSearch from "@/components/shared/search/search";

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

            <Filter />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
