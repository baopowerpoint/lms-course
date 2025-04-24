"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b py-4 px-4 md:px-8 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">Havamath</span>
        </Link>

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

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button className="rounded-full" asChild>
            <Link href="/signup">Bắt đầu học ngay</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4 bg-white">
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
            href="/courses"
            className={`block py-2 font-medium hover:text-primary ${
              pathname === "/courses" ? "text-primary" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Khoá học
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
          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full rounded-full" asChild>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
            </Button>
            <Button className="w-full rounded-full" asChild>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Bắt đầu học ngay</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
