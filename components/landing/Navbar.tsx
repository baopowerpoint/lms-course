"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Duolingo from "../ui/duolingo-button";
import CategoryDropdown from "./CategoryDropdown";
import MobileCategoryList from "./MobileCategoryList";
import { Suspense } from "react";
import { Loader2, BookOpen } from "lucide-react";
import MobileCategorySelect from "./MobileCategorySelect";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b py-3 px-3 md:py-4 md:px-8 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-primary">
              Havamath
            </span>
          </Link>

          <div className="hidden md:block">
            <Suspense
              fallback={
                <span className="text-sm font-medium text-gray-500">
                  Đang tải...
                </span>
              }
            >
              <CategoryDropdown />
            </Suspense>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/#features"
            className={`font-medium hover:text-primary transition-colors ${
              pathname === "/#features" ? "text-primary" : ""
            }`}
          >
            Tính năng
          </Link>
          <Link
            href="/courses"
            className={`font-medium hover:text-primary transition-colors ${
              pathname === "/courses" ? "text-primary" : ""
            }`}
          >
            Khoá học
          </Link>
          <Link
            href="/#about"
            className={`font-medium hover:text-primary transition-colors ${
              pathname === "/#about" ? "text-primary" : ""
            }`}
          >
            Về chúng tôi
          </Link>
          <Link
            href="/pricing"
            className={`font-medium hover:text-primary transition-colors ${
              pathname === "/pricing" ? "text-primary" : ""
            }`}
          >
            Bảng giá
          </Link>
        </div>
        {/* Mobile Categories Visible Always */}
        <div className="md:hidden">
          <Suspense
            fallback={
              <span className="text-xs text-gray-500 flex items-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Đang tải...
              </span>
            }
          >
            <MobileCategorySelect />
          </Suspense>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2">
          <SignedIn>
            {/* Chỉ hiển thị UserButton trên desktop */}
            <div className="hidden md:block">
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/sign-in">Đăng nhập</Link>
              </Button>
              <Duolingo className="rounded-full">
                <Link href="/sign-up">Bắt đầu học ngay</Link>
              </Duolingo>
            </div>
          </SignedOut>

          <button
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4 bg-white">
          {/* Danh mục khoá học được hiển thị đầu tiên và nổi bật */}
          <div className="py-3 border-b">
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">
                Danh mục khoá học
              </span>
            </div>
            <Link
              href="/courses"
              className="block py-2 ml-1 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tất cả khoá học
            </Link>
            <Suspense
              fallback={
                <div className="pl-1 py-2 flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-gray-500">Đang tải danh mục...</span>
                </div>
              }
            >
              <MobileCategoryList
                closeMenu={() => setIsMobileMenuOpen(false)}
              />
            </Suspense>
          </div>

          {/* User Profile in Mobile Menu */}
          <SignedIn>
            <div className="py-3 border-b">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-primary">
                  Tài khoản của bạn
                </span>
              </div>
              <div className="pl-1 py-2">
                <div className="flex items-center gap-3">
                  <UserButton />
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Xem học liệu
                  </Link>
                </div>
              </div>
            </div>
          </SignedIn>

          {/* Các mục menu khác */}
          <Link
            href="/#features"
            className={`block py-2 font-medium hover:text-primary ${
              pathname === "/#features" ? "text-primary" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tính năng
          </Link>

          <Link
            href="/#about"
            className={`block py-2 font-medium hover:text-primary ${
              pathname === "/#about" ? "text-primary" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Về chúng tôi
          </Link>
          <Link
            href="/pricing"
            className={`block py-2 font-medium hover:text-primary ${
              pathname === "/pricing" ? "text-primary" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Bảng giá
          </Link>
          <SignedOut>
            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-full text-green-600   "
                asChild
              >
                <Link
                  href="/sign-in"
                  className="text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              </Button>
              <Duolingo className="w-full rounded-full">
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Bắt đầu học ngay
                </Link>
              </Duolingo>
            </div>
          </SignedOut>
        </div>
      )}
    </nav>
  );
};
