import { getCourseBySlug } from "@/lib/actions/course.action";
import { formatPrice } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetails from "@/components/courses/CourseDetails";

type Props = {
  params: {
    courseId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourseBySlug(params.courseId);

  if (!course) {
    return {
      title: "Không tìm thấy khóa học",
      description: "Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  return {
    title: `${course.title} | LMS`,
    description:
      course.description || `Khám phá khóa học ${course.title} ngay hôm nay`,
    openGraph: course.image
      ? {
          images: [
            { url: course.image, width: 1200, height: 630, alt: course.title },
          ],
        }
      : undefined,
  };
}

const CourseDetailPage = async ({ params }: Props) => {
  const course = await getCourseBySlug(params.courseId);

  if (!course) {
    notFound();
  }

  return <CourseDetails course={course} />;
};

export default CourseDetailPage;
