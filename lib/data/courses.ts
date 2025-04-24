export type CourseCategory = 
  | "algebra" 
  | "geometry" 
  | "calculus" 
  | "arithmetic" 
  | "statistics" 
  | "probability";

export type CourseGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  salePrice?: number;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  category: CourseCategory;
  grade: CourseGrade;
  level: CourseLevel;
  lessonsCount: number;
  durationInMinutes: number;
  updatedAt: string;
  instructor: {
    name: string;
    avatar: string;
  };
  topics: string[];
}

// Vietnamese-friendly category names
export const categoryNames: Record<CourseCategory, string> = {
  algebra: "Đại số",
  geometry: "Hình học",
  calculus: "Giải tích",
  arithmetic: "Số học",
  statistics: "Thống kê",
  probability: "Xác suất"
};

// Generate course thumbnails - in real app these would be actual images
const generateThumbnail = (category: CourseCategory, _grade: CourseGrade): string => {
  const colors: Record<CourseCategory, string> = {
    algebra: "bg-blue-500",
    geometry: "bg-green-500",
    calculus: "bg-purple-500",
    arithmetic: "bg-orange-500",
    statistics: "bg-red-500",
    probability: "bg-yellow-500"
  };
  
  return colors[category];
};

// Create sample courses
export const courses: Course[] = [
  // Algebra courses
  {
    id: "alg-1",
    title: "Đại số cơ bản lớp 6",
    description: "Khám phá nền tảng đại số với các khái niệm cơ bản như biểu thức, phương trình và bất phương trình.",
    thumbnail: generateThumbnail("algebra", 6),
    price: 299000,
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 125,
    category: "algebra",
    grade: 6,
    level: "beginner",
    lessonsCount: 24,
    durationInMinutes: 720,
    updatedAt: "2025-03-15T00:00:00Z",
    instructor: {
      name: "Nguyễn Văn Toán",
      avatar: "NVT"
    },
    topics: ["Biểu thức đại số", "Phương trình bậc nhất", "Bất phương trình"]
  },
  {
    id: "alg-2",
    title: "Đại số nâng cao lớp 9",
    description: "Phát triển kỹ năng đại số với chủ đề nâng cao như hàm số, phương trình bậc hai và bất phương trình.",
    thumbnail: generateThumbnail("algebra", 9),
    price: 399000,
    salePrice: 349000,
    isFeatured: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 87,
    category: "algebra",
    grade: 9,
    level: "intermediate",
    lessonsCount: 32,
    durationInMinutes: 960,
    updatedAt: "2025-04-10T00:00:00Z",
    instructor: {
      name: "Trần Thị Bình",
      avatar: "TTB"
    },
    topics: ["Hàm số", "Phương trình bậc hai", "Bất phương trình bậc hai"]
  },
  
  // Geometry courses
  {
    id: "geo-1",
    title: "Hình học cơ bản lớp 7",
    description: "Khám phá các khái niệm hình học cơ bản bao gồm các hình phẳng, đo góc, và các tính chất cơ bản.",
    thumbnail: generateThumbnail("geometry", 7),
    price: 299000,
    isFeatured: false,
    isNew: false,
    rating: 4.7,
    reviewCount: 93,
    category: "geometry",
    grade: 7,
    level: "beginner",
    lessonsCount: 28,
    durationInMinutes: 840,
    updatedAt: "2025-02-20T00:00:00Z",
    instructor: {
      name: "Lê Thị Hình",
      avatar: "LTH"
    },
    topics: ["Góc và tam giác", "Tứ giác", "Đường tròn"]
  },
  {
    id: "geo-2",
    title: "Hình học không gian lớp 11",
    description: "Giải quyết các vấn đề hình học phức tạp trong không gian ba chiều với kỹ thuật vector và tọa độ.",
    thumbnail: generateThumbnail("geometry", 11),
    price: 499000,
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 105,
    category: "geometry",
    grade: 11,
    level: "advanced",
    lessonsCount: 36,
    durationInMinutes: 1080,
    updatedAt: "2025-03-05T00:00:00Z",
    instructor: {
      name: "Phạm Văn Không",
      avatar: "PVK"
    },
    topics: ["Vector trong không gian", "Phương trình mặt cầu", "Khối đa diện"]
  },
  
  // Calculus courses
  {
    id: "cal-1",
    title: "Giải tích cơ bản lớp 10",
    description: "Giới thiệu các khái niệm giải tích cơ bản bao gồm hàm số, giới hạn, và đạo hàm.",
    thumbnail: generateThumbnail("calculus", 10),
    price: 399000,
    isFeatured: false,
    isNew: true,
    rating: 4.6,
    reviewCount: 78,
    category: "calculus",
    grade: 10,
    level: "intermediate",
    lessonsCount: 30,
    durationInMinutes: 900,
    updatedAt: "2025-04-20T00:00:00Z",
    instructor: {
      name: "Nguyễn Thị Tích",
      avatar: "NTT"
    },
    topics: ["Giới hạn hàm số", "Đạo hàm", "Ứng dụng đạo hàm"]
  },
  {
    id: "cal-2",
    title: "Giải tích nâng cao lớp 12",
    description: "Phát triển kỹ năng giải tích với nguyên hàm, tích phân và các ứng dụng thực tế.",
    thumbnail: generateThumbnail("calculus", 12),
    price: 599000,
    salePrice: 499000,
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 118,
    category: "calculus",
    grade: 12,
    level: "advanced",
    lessonsCount: 40,
    durationInMinutes: 1200,
    updatedAt: "2025-03-25T00:00:00Z",
    instructor: {
      name: "Trần Văn Phân",
      avatar: "TVP"
    },
    topics: ["Nguyên hàm", "Tích phân", "Ứng dụng tích phân"]
  },
  
  // Arithmetic courses
  {
    id: "ari-1",
    title: "Số học cơ bản lớp 1",
    description: "Xây dựng nền tảng vững chắc với các kỹ năng số học cơ bản cho trẻ em.",
    thumbnail: generateThumbnail("arithmetic", 1),
    price: 199000,
    isFeatured: false,
    isNew: false,
    rating: 4.9,
    reviewCount: 156,
    category: "arithmetic",
    grade: 1,
    level: "beginner",
    lessonsCount: 20,
    durationInMinutes: 600,
    updatedAt: "2025-01-10T00:00:00Z",
    instructor: {
      name: "Lê Thị Cộng",
      avatar: "LTC"
    },
    topics: ["Đếm số", "Phép cộng trừ", "Số và chữ số"]
  },
  {
    id: "ari-2",
    title: "Số học nâng cao lớp 4",
    description: "Làm chủ phép tính với phân số, số thập phân và các bài toán thực tế.",
    thumbnail: generateThumbnail("arithmetic", 4),
    price: 249000,
    isFeatured: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 92,
    category: "arithmetic",
    grade: 4,
    level: "intermediate",
    lessonsCount: 24,
    durationInMinutes: 720,
    updatedAt: "2025-04-15T00:00:00Z",
    instructor: {
      name: "Nguyễn Văn Số",
      avatar: "NVS"
    },
    topics: ["Phân số", "Số thập phân", "Đo lường"]
  },
  
  // Statistics courses
  {
    id: "sta-1",
    title: "Thống kê cơ bản lớp 7",
    description: "Học cách thu thập, phân tích và biểu diễn dữ liệu với các công cụ thống kê đơn giản.",
    thumbnail: generateThumbnail("statistics", 7),
    price: 299000,
    isFeatured: false,
    isNew: false,
    rating: 4.7,
    reviewCount: 85,
    category: "statistics",
    grade: 7,
    level: "beginner",
    lessonsCount: 22,
    durationInMinutes: 660,
    updatedAt: "2025-02-28T00:00:00Z",
    instructor: {
      name: "Phạm Thị Kê",
      avatar: "PTK"
    },
    topics: ["Biểu đồ", "Số trung bình", "Mô hình dữ liệu"]
  },
  {
    id: "sta-2",
    title: "Thống kê nâng cao lớp 12",
    description: "Phân tích dữ liệu phức tạp với các kỹ thuật thống kê nâng cao và ứng dụng thực tế.",
    thumbnail: generateThumbnail("statistics", 12),
    price: 499000,
    isFeatured: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 76,
    category: "statistics",
    grade: 12,
    level: "advanced",
    lessonsCount: 32,
    durationInMinutes: 960,
    updatedAt: "2025-04-22T00:00:00Z",
    instructor: {
      name: "Trần Văn Liệu",
      avatar: "TVL"
    },
    topics: ["Phân phối xác suất", "Ước lượng", "Kiểm định giả thuyết"]
  },
  
  // Probability courses
  {
    id: "pro-1",
    title: "Xác suất cơ bản lớp 9",
    description: "Giới thiệu các khái niệm xác suất cơ bản và ứng dụng trong các vấn đề thực tế.",
    thumbnail: generateThumbnail("probability", 9),
    price: 349000,
    isFeatured: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 88,
    category: "probability",
    grade: 9,
    level: "intermediate",
    lessonsCount: 26,
    durationInMinutes: 780,
    updatedAt: "2025-01-15T00:00:00Z",
    instructor: {
      name: "Lê Văn Suất",
      avatar: "LVS"
    },
    topics: ["Xác suất cổ điển", "Biến ngẫu nhiên", "Phân phối xác suất"]
  },
  {
    id: "pro-2",
    title: "Xác suất nâng cao lớp 11",
    description: "Làm chủ lý thuyết xác suất nâng cao và ứng dụng trong giải quyết vấn đề phức tạp.",
    thumbnail: generateThumbnail("probability", 11),
    price: 449000,
    salePrice: 399000,
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 94,
    category: "probability",
    grade: 11,
    level: "advanced",
    lessonsCount: 30,
    durationInMinutes: 900,
    updatedAt: "2025-03-10T00:00:00Z",
    instructor: {
      name: "Phạm Thị Ngẫu",
      avatar: "PTN"
    },
    topics: ["Biến ngẫu nhiên liên tục", "Luật số lớn", "Ứng dụng thực tế"]
  }
];
