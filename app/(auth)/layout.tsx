import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Havamath - Xác thực",
  description: "Đăng nhập hoặc đăng ký tài khoản Havamath",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <header className="py-6 px-4 md:px-8 w-full">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Havamath</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Havamath. Đã đăng ký bản quyền.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/terms" className="hover:text-primary">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Bảo mật
            </Link>
            <Link href="/help" className="hover:text-primary">
              Trợ giúp
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
