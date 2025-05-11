"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut,
  Bookmark
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const DashboardSidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/dashboard",
    },
    {
      icon: BookOpen,
      label: "Khóa học của tôi",
      href: "/dashboard/courses",
    },
    {
      icon: Bookmark,
      label: "Đã lưu",
      href: "/dashboard/bookmarks",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-primary">Học viên</h1>
      </div>
      
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <SignOutButton>
          <button className="flex items-center px-3 py-2 w-full text-sm font-medium text-red-600 rounded-md hover:bg-red-50">
            <LogOut className="mr-3 h-5 w-5" />
            Đăng xuất
          </button>
        </SignOutButton>
      </div>
    </div>
  );
};

export default DashboardSidebar;
