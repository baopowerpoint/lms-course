import { Metadata } from "next";
import CourseCreator from "@/components/admin/CourseCreator";

export const metadata: Metadata = {
  title: "Tạo khóa học nhanh | Admin",
  description: "Tạo khóa học, module và bài học nhanh chóng chỉ với một lần click",
};

export default function CourseCreatorPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Tạo khóa học nhanh</h1>
      <p className="text-muted-foreground mb-6">
        Tạo khóa học và các module, bài học liên quan chỉ với một lần nhập liệu.
        Tất cả dữ liệu sẽ được tạo trong Sanity CMS ngay lập tức.
      </p>
      <CourseCreator />
    </div>
  );
}
