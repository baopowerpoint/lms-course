import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { viVN } from "@clerk/localizations";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Havamath",
  description: "Havamath - Học toán cùng Havabook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={viVN}>
      <html lang="vi">
        <body className={`${quicksand.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
