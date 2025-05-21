"use client";

import { ReactNode } from "react";
import { ChatButton } from "@/components/chat/ChatButton";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  children: ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  
  return (
    <>
      {children}
      {!isAdminPage && <ChatButton />}
    </>
  );
};
