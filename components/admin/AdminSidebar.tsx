"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BookOpen, 
  LogOut,
  CreditCard,
  KeyIcon,
  PlusCircle,
  MessageSquare
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const AdminSidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: Users,
      label: "Quản lý người dùng",
      href: "/admin/users",
    },
    {
      icon: CreditCard,
      label: "Quản lý thanh toán",
      href: "/admin/payments",
    },
    {
      icon: ShoppingCart,
      label: "Quản lý đơn hàng",
      href: "/admin/orders",
    },
    {
      icon: BookOpen,
      label: "Quản lý khóa học",
      href: "/admin/courses",
    },
    {
      icon: PlusCircle,
      label: "Tạo khóa học nhanh",
      href: "/admin/course-creator",
    },
    {
      icon: MessageSquare,
      label: "Quản lý tin nhắn",
      href: "/admin/chat",
    },
    {
      icon: KeyIcon,
      label: "Quản lý mã kích hoạt",
      href: "/admin/codes",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
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

export default AdminSidebar;
