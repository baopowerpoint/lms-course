export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationInMinutes: number;
  isFree: boolean;
  videoUrl?: string;
  order: number;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

// Function to generate mock lessons for a course
export const generateLessonsForCourse = (courseId: string): Chapter[] => {
  // Based on the course ID, generate appropriate lessons
  if (courseId.startsWith("alg")) {
    return [
      {
        id: "alg-ch-1",
        title: "Giới thiệu về Đại số",
        order: 1,
        lessons: [
          {
            id: "alg-l-1",
            title: "Khái niệm cơ bản",
            description: "Giới thiệu về các khái niệm đại số cơ bản và cách áp dụng.",
            durationInMinutes: 10,
            isFree: true,
            videoUrl: "https://example.com/videos/alg-l-1",
            order: 1
          },
          {
            id: "alg-l-2",
            title: "Biểu thức đại số",
            description: "Học cách viết và hiểu các biểu thức đại số.",
            durationInMinutes: 15,
            isFree: true,
            videoUrl: "https://example.com/videos/alg-l-2",
            order: 2
          },
          {
            id: "alg-l-3",
            title: "Đơn giản hoá biểu thức",
            description: "Các phương pháp đơn giản hoá biểu thức đại số.",
            durationInMinutes: 20,
            isFree: false,
            videoUrl: "https://example.com/videos/alg-l-3",
            order: 3
          }
        ]
      },
      {
        id: "alg-ch-2",
        title: "Phương trình và Bất phương trình",
        order: 2,
        lessons: [
          {
            id: "alg-l-4",
            title: "Phương trình bậc nhất",
            description: "Học cách giải phương trình bậc nhất.",
            durationInMinutes: 18,
            isFree: false,
            videoUrl: "https://example.com/videos/alg-l-4",
            order: 1
          },
          {
            id: "alg-l-5",
            title: "Bất phương trình bậc nhất",
            description: "Học cách giải bất phương trình bậc nhất.",
            durationInMinutes: 22,
            isFree: false,
            videoUrl: "https://example.com/videos/alg-l-5",
            order: 2
          },
          {
            id: "alg-l-6",
            title: "Hệ phương trình",
            description: "Giải hệ phương trình bậc nhất hai ẩn.",
            durationInMinutes: 25,
            isFree: false,
            videoUrl: "https://example.com/videos/alg-l-6",
            order: 3
          }
        ]
      },
      {
        id: "alg-ch-3",
        title: "Ứng dụng Đại số",
        order: 3,
        lessons: [
          {
            id: "alg-l-7",
            title: "Bài toán thực tế",
            description: "Áp dụng đại số để giải quyết các bài toán thực tế.",
            durationInMinutes: 15,
            isFree: false,
            videoUrl: "https://example.com/videos/alg-l-7",
            order: 1
          },
          {
            id: "alg-l-8",
            title: "Bài tập tổng hợp",
            description: "Luyện tập với các bài tập đại số tổng hợp.",
            durationInMinutes: 30,
            isFree: false,
            videoUrl: "https://example.com/videos/alg-l-8",
            order: 2
          }
        ]
      }
    ];
  } else if (courseId.startsWith("geo")) {
    return [
      {
        id: "geo-ch-1",
        title: "Giới thiệu về Hình học",
        order: 1,
        lessons: [
          {
            id: "geo-l-1",
            title: "Khái niệm cơ bản trong hình học",
            description: "Giới thiệu về các khái niệm hình học cơ bản.",
            durationInMinutes: 12,
            isFree: true,
            videoUrl: "https://example.com/videos/geo-l-1",
            order: 1
          },
          {
            id: "geo-l-2",
            title: "Điểm, đường thẳng và góc",
            description: "Tìm hiểu về điểm, đường thẳng và góc trong hình học phẳng.",
            durationInMinutes: 18,
            isFree: true,
            videoUrl: "https://example.com/videos/geo-l-2",
            order: 2
          },
          {
            id: "geo-l-3",
            title: "Đa giác",
            description: "Học về các loại đa giác và tính chất.",
            durationInMinutes: 22,
            isFree: false,
            videoUrl: "https://example.com/videos/geo-l-3",
            order: 3
          }
        ]
      },
      {
        id: "geo-ch-2",
        title: "Tam giác",
        order: 2,
        lessons: [
          {
            id: "geo-l-4",
            title: "Tính chất tam giác",
            description: "Tìm hiểu các tính chất cơ bản của tam giác.",
            durationInMinutes: 20,
            isFree: false,
            videoUrl: "https://example.com/videos/geo-l-4",
            order: 1
          },
          {
            id: "geo-l-5",
            title: "Định lý Pythagoras",
            description: "Học và áp dụng định lý Pythagoras.",
            durationInMinutes: 15,
            isFree: false,
            videoUrl: "https://example.com/videos/geo-l-5",
            order: 2
          },
          {
            id: "geo-l-6",
            title: "Tam giác đồng dạng",
            description: "Hiểu về tam giác đồng dạng và ứng dụng.",
            durationInMinutes: 25,
            isFree: false,
            videoUrl: "https://example.com/videos/geo-l-6",
            order: 3
          }
        ]
      }
    ];
  } else {
    // Default lessons for other course types
    return [
      {
        id: `${courseId}-ch-1`,
        title: "Chương 1: Khái niệm cơ bản",
        order: 1,
        lessons: [
          {
            id: `${courseId}-l-1`,
            title: "Bài 1: Giới thiệu",
            description: "Giới thiệu tổng quan về khoá học.",
            durationInMinutes: 10,
            isFree: true,
            videoUrl: `https://example.com/videos/${courseId}-l-1`,
            order: 1
          },
          {
            id: `${courseId}-l-2`,
            title: "Bài 2: Khái niệm cơ bản",
            description: "Tìm hiểu các khái niệm cơ bản của môn học.",
            durationInMinutes: 15,
            isFree: true,
            videoUrl: `https://example.com/videos/${courseId}-l-2`,
            order: 2
          },
          {
            id: `${courseId}-l-3`,
            title: "Bài 3: Lý thuyết cơ bản",
            description: "Các lý thuyết cơ bản cần nắm vững.",
            durationInMinutes: 20,
            isFree: false,
            videoUrl: `https://example.com/videos/${courseId}-l-3`,
            order: 3
          }
        ]
      },
      {
        id: `${courseId}-ch-2`,
        title: "Chương 2: Ứng dụng thực tế",
        order: 2,
        lessons: [
          {
            id: `${courseId}-l-4`,
            title: "Bài 4: Ứng dụng cơ bản",
            description: "Các ứng dụng cơ bản trong thực tế.",
            durationInMinutes: 18,
            isFree: false,
            videoUrl: `https://example.com/videos/${courseId}-l-4`,
            order: 1
          },
          {
            id: `${courseId}-l-5`,
            title: "Bài 5: Bài tập ứng dụng",
            description: "Thực hành với các bài tập ứng dụng.",
            durationInMinutes: 22,
            isFree: false,
            videoUrl: `https://example.com/videos/${courseId}-l-5`,
            order: 2
          }
        ]
      }
    ];
  }
};
