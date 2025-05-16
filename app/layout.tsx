import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { viVN } from "@clerk/localizations";
import Providers from "@/components/providers/query";
import NextTopLoader from "nextjs-toploader";
const quicksand = Quicksand({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Havamath",
  description: "Havamath - Học toán cùng Havamath",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={viVN}>
      <html lang="vi">
        <body className={`${quicksand.className} antialiased`}>
          <NextTopLoader 
            color="#10b981" 
            showSpinner={false} 
            height={3}
            shadow="0 0 10px #10b981,0 0 5px #10b981"
          />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
