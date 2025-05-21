"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  // Categories of FAQ questions
  const categories = [
    { id: "general", name: "Tổng quan" },
    { id: "courses", name: "Khoá học" },
    { id: "payment", name: "Thanh toán" },
    { id: "account", name: "Tài khoản" },
    { id: "technical", name: "Kỹ thuật" },
  ];

  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const faqData = {
    general: [
      {
        id: "what-is-havamath",
        question: "Havamath là gì?",
        answer: "Havamath là nền tảng học toán trực tuyến giúp học sinh khám phá niềm vui trong học toán với phương pháp học tập tương tác và cá nhân hoá. Chúng tôi cung cấp các khoá học chất lượng cao được thiết kế bởi các giáo viên có kinh nghiệm, giúp học sinh tiến bộ mỗi ngày."
      },
      {
        id: "hellohava-courses",
        question: "Hellohava là khoá học online nào?",
        answer: "Hellohava là nền tảng giáo dục trực tuyến cung cấp các khoá học toán học từ cơ bản đến nâng cao. Chúng tôi chuyên về các khoá học toán học với nội dung tương tác cao, video bài giảng, bài tập thực hành và hệ thống đánh giá tự động. Khoá học của chúng tôi được thiết kế để phù hợp với chương trình giáo dục Việt Nam, giúp học sinh củng cố kiến thức nền tảng và phát triển tư duy logic."
      },
      {
        id: "who-can-use",
        question: "Ai có thể sử dụng Havamath?",
        answer: "Havamath phù hợp với mọi đối tượng học sinh từ tiểu học đến trung học phổ thông, cũng như người học muốn củng cố kiến thức nền tảng toán học. Nền tảng của chúng tôi được thiết kế để phù hợp với nhiều cấp độ học tập khác nhau."
      },
      {
        id: "benefits",
        question: "Lợi ích khi học tập tại Havamath?",
        answer: "Học tập tại Havamath mang lại nhiều lợi ích như: Tiếp cận nội dung học tập chất lượng cao, học theo tốc độ riêng, nhận phản hồi tức thì, theo dõi tiến độ học tập, tương tác với cộng đồng học viên và giáo viên, và nhận chứng chỉ hoàn thành khi kết thúc khoá học."
      },
      {
        id: "hellohava-benefits",
        question: "Ưu điểm khi học tập cùng trang web Hellohava",
        answer: "Học tập cùng Hellohava mang lại nhiều ưu điểm vượt trội: (1) Phương pháp học cá nhân hoá thông qua AI, tự động điều chỉnh theo trình độ của từng học viên; (2) Nội dung bài giảng được thiết kế kỹ lưỡng với hàng ngàn bài tập chất lượng; (3) Giao diện trực quan, dễ sử dụng, phù hợp với mọi độ tuổi; (4) Tư duy học tập độc đáo kết hợp giữa lý thuyết và thực hành; (5) Hệ thống hỗ trợ 24/7 từ đội ngũ giáo viên giàu kinh nghiệm."
      },
      {
        id: "get-started",
        question: "Làm thế nào để bắt đầu với Havamath?",
        answer: "Để bắt đầu, bạn chỉ cần đăng ký tài khoản miễn phí, khám phá các khoá học có sẵn, và đăng ký khoá học phù hợp với nhu cầu của bạn. Sau khi đăng ký, bạn có thể bắt đầu học ngay lập tức trên máy tính, máy tính bảng hoặc điện thoại di động."
      },
    ],
    courses: [
      {
        id: "age-range",
        question: "Khoá học online Hellohava dành cho độ tuổi nào?",
        answer: "Khoá học online Hellohava được thiết kế phù hợp cho học sinh từ lớp 1 đến lớp 12 (6-18 tuổi). Chúng tôi có các khoá học được phân chia theo cấp độ và độ tuổi, bao gồm: Tiểu học (6-10 tuổi), THCS (11-14 tuổi), và THPT (15-18 tuổi). Mỗi khoá học được thiết kế với ngôn ngữ, giao diện và nội dung phù hợp với từng độ tuổi, giúp học sinh dễ dàng tiếp thu kiến thức một cách hiệu quả."
      },
      {
        id: "courses-available",
        question: "Havamath cung cấp những khoá học nào?",
        answer: "Havamath cung cấp nhiều khoá học toán học từ cơ bản đến nâng cao, bao gồm đại số, hình học, giải tích, thống kê, và nhiều chủ đề khác. Chúng tôi liên tục cập nhật và bổ sung thêm các khoá học mới để đáp ứng nhu cầu học tập đa dạng."
      },
      {
        id: "course-format",
        question: "Khoá học được tổ chức như thế nào?",
        answer: "Mỗi khoá học bao gồm nhiều module, mỗi module chứa các bài học video, tài liệu đọc, bài tập tương tác, và bài kiểm tra. Học viên có thể theo dõi tiến độ học tập của mình qua bảng điều khiển cá nhân và nhận được huy hiệu khi hoàn thành các mốc quan trọng."
      },
      {
        id: "course-access",
        question: "Tôi có thể truy cập khoá học trong bao lâu?",
        answer: "Thời gian truy cập phụ thuộc vào gói đăng ký của bạn. Gói Cơ bản cung cấp quyền truy cập trong 3 tháng, gói Nâng cao trong 6 tháng, và gói Chuyên sâu cung cấp quyền truy cập vĩnh viễn vào nội dung khoá học."
      },
      {
        id: "certificate",
        question: "Tôi có nhận được chứng chỉ sau khi hoàn thành khoá học không?",
        answer: "Có, học viên sẽ nhận được chứng chỉ hoàn thành sau khi hoàn thành khoá học. Đối với gói Chuyên sâu, chứng chỉ được xác nhận và có thể chia sẻ trên các nền tảng mạng xã hội hoặc sử dụng trong hồ sơ học tập."
      },
    ],
    payment: [
      {
        id: "payment-methods",
        question: "Havamath chấp nhận những phương thức thanh toán nào?",
        answer: "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, MasterCard), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), và thanh toán qua QR Code. Tất cả các giao dịch đều được bảo mật và mã hoá."
      },
      {
        id: "subscription-cancel",
        question: "Tôi có thể huỷ đăng ký của mình không?",
        answer: "Có, bạn có thể huỷ đăng ký bất cứ lúc nào trong trang cài đặt tài khoản. Nếu huỷ trước khi kết thúc chu kỳ thanh toán, bạn vẫn có thể truy cập nội dung cho đến hết chu kỳ đó. Chúng tôi không hoàn tiền cho các khoản thanh toán đã thực hiện."
      },
      {
        id: "refund-policy",
        question: "Chính sách hoàn tiền của Havamath như thế nào?",
        answer: "Havamath cung cấp bảo đảm hoàn tiền trong vòng 7 ngày đầu tiên sau khi đăng ký. Nếu bạn không hài lòng với dịch vụ, bạn có thể yêu cầu hoàn tiền đầy đủ trong thời gian này. Sau 7 ngày, chúng tôi không thực hiện hoàn tiền cho các khoá học đã đăng ký."
      },
      {
        id: "invoice",
        question: "Tôi có thể nhận hoá đơn cho việc thanh toán không?",
        answer: "Có, bạn sẽ nhận được hoá đơn điện tử qua email sau khi hoàn tất thanh toán. Nếu bạn cần hoá đơn VAT, vui lòng cung cấp thông tin công ty của bạn trong quá trình thanh toán hoặc liên hệ với bộ phận hỗ trợ của chúng tôi sau khi thanh toán."
      },
    ],
    account: [
      {
        id: "account-creation",
        question: "Làm thế nào để tạo tài khoản Havamath?",
        answer: "Bạn có thể tạo tài khoản bằng cách nhấp vào nút 'Đăng ký' trên trang chủ, điền thông tin cá nhân của bạn, xác nhận email, và thiết lập mật khẩu. Bạn cũng có thể đăng ký bằng tài khoản Google hoặc Facebook để đơn giản hoá quy trình."
      },
      {
        id: "login-process",
        question: "Đăng nhập vào trang web thế nào",
        answer: "Để đăng nhập vào Hellohava, bạn có thể thực hiện theo các bước sau: (1) Truy cập trang web Hellohava.com; (2) Nhấp vào nút 'Đăng nhập' ở góc trên bên phải màn hình; (3) Nhập địa chỉ email và mật khẩu đã đăng ký; (4) Hoặc bạn có thể chọn đăng nhập nhanh bằng tài khoản Google, Facebook hoặc Apple ID. Nếu gặp khó khăn khi đăng nhập, hãy sử dụng tính năng 'Quên mật khẩu' hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi."
      },
      {
        id: "password-reset",
        question: "Tôi quên mật khẩu, làm thế nào để đặt lại?",
        answer: "Nếu bạn quên mật khẩu, nhấp vào liên kết 'Quên mật khẩu' trên trang đăng nhập. Nhập địa chỉ email đã đăng ký và bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu. Đảm bảo kiểm tra cả thư mục spam nếu bạn không thấy email trong hộp thư đến."
      },
      {
        id: "profile-update",
        question: "Làm thế nào để cập nhật thông tin cá nhân?",
        answer: "Bạn có thể cập nhật thông tin cá nhân trong phần 'Hồ sơ' của trang tài khoản. Tại đây, bạn có thể thay đổi tên, email, mật khẩu, và các thông tin khác. Hãy đảm bảo lưu các thay đổi sau khi cập nhật."
      },
      {
        id: "account-delete",
        question: "Làm thế nào để xoá tài khoản của tôi?",
        answer: "Để xoá tài khoản, vui lòng truy cập mục 'Cài đặt tài khoản' và nhấp vào 'Xoá tài khoản'. Bạn sẽ được yêu cầu xác nhận quyết định này. Lưu ý rằng việc xoá tài khoản là không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xoá vĩnh viễn."
      },
    ],
    technical: [
      {
        id: "system-requirements",
        question: "Yêu cầu hệ thống để sử dụng Havamath là gì?",
        answer: "Havamath hoạt động trên hầu hết các trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge) với kết nối internet ổn định. Đối với trải nghiệm tốt nhất, chúng tôi khuyên bạn nên sử dụng phiên bản trình duyệt mới nhất và có kết nối internet tối thiểu 2 Mbps."
      },
      {
        id: "mobile-compatibility",
        question: "Tôi có thể sử dụng Havamath trên điện thoại di động không?",
        answer: "Có, Havamath tương thích hoàn toàn với các thiết bị di động. Bạn có thể truy cập qua trình duyệt di động hoặc tải xuống ứng dụng của chúng tôi từ App Store (iOS) hoặc Google Play Store (Android) để có trải nghiệm tối ưu hơn."
      },
      {
        id: "offline-access",
        question: "Tôi có thể học offline không?",
        answer: "Người dùng gói Nâng cao và Chuyên sâu có thể tải xuống một số nội dung khoá học để học offline. Tuy nhiên, các tính năng tương tác như bài kiểm tra, diễn đàn, và cập nhật tiến độ vẫn yêu cầu kết nối internet."
      },
      {
        id: "technical-issues",
        question: "Tôi gặp vấn đề kỹ thuật, làm thế nào để được hỗ trợ?",
        answer: "Nếu bạn gặp vấn đề kỹ thuật, vui lòng truy cập trung tâm trợ giúp của chúng tôi hoặc liên hệ với đội ngũ hỗ trợ kỹ thuật qua email support@havamath.com. Chúng tôi cũng có hỗ trợ trực tuyến trong giờ làm việc từ 8:00 đến 20:00 hàng ngày."
      },
    ],
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Câu hỏi thường gặp</h1>
          <p className="text-xl text-gray-600">
            Tìm câu trả lời cho những thắc mắc phổ biến về Havamath và các dịch vụ của chúng tôi.
          </p>
        </div>
        
        {/* FAQ Categories */}
        <div className="flex overflow-x-auto md:justify-center gap-2 md:gap-4 mb-12 pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Questions and Answers */}
        <div className="max-w-4xl mx-auto">
          {faqData[activeCategory as keyof typeof faqData].map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleQuestion(item.id)}
                className={`w-full text-left p-6 flex justify-between items-center rounded-lg ${
                  openQuestions.includes(item.id)
                    ? "bg-white shadow-md"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <h3 className="text-lg font-medium">{item.question}</h3>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openQuestions.includes(item.id) ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openQuestions.includes(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 bg-white rounded-b-lg">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions section */}
        <div className="mt-16 bg-white p-8 md:p-12 rounded-2xl max-w-4xl mx-auto shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Vẫn còn thắc mắc?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, đừng ngại liên hệ với chúng tôi. 
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                Xem bảng giá
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg">
                Khám phá khoá học
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
