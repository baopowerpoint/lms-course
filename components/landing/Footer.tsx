"use client";

import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Sản phẩm",
      links: [
        { label: "Khoá học", href: "/courses" },
        { label: "Dành cho giáo viên", href: "/for-teachers" },
        { label: "Dành cho phụ huynh", href: "/for-parents" },
        { label: "Dành cho trường học", href: "/for-schools" },
        { label: "Bảng giá", href: "/pricing" },
      ]
    },
    {
      title: "Về chúng tôi",
      links: [
        { label: "Giới thiệu", href: "/about" },
        { label: "Đội ngũ", href: "/team" },
        { label: "Tuyển dụng", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Liên hệ", href: "/contact" },
      ]
    },
    {
      title: "Hỗ trợ",
      links: [
        { label: "Trung tâm trợ giúp", href: "/help" },
        { label: "Câu hỏi thường gặp", href: "/faq" },
        { label: "Điều khoản sử dụng", href: "/terms" },
        { label: "Chính sách bảo mật", href: "/privacy" },
      ]
    }
  ];

  return (
    <footer className="bg-white border-t pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-primary">Havamath</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Havamath giúp học sinh khám phá niềm vui trong học toán với phương pháp học tập tương tác và cá nhân hoá, giúp bạn tiến bộ mỗi ngày.
            </p>
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <a 
                  key={social} 
                  href={`https://${social}.com`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-gray-900 mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            © {currentYear} Havamath. Đã đăng ký bản quyền.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-primary">
              Điều khoản
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">
              Bảo mật
            </Link>
            <Link href="/cookies" className="text-sm text-gray-600 hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
