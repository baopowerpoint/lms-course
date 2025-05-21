"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CoursePreview } from "@/components/landing/CoursePreview";
import { CallToAction } from "@/components/landing/CallToAction";
import { Footer } from "@/components/landing/Footer";
import PromotionPopup from "@/components/home/PromotionPopup";
import PromotionSection from "@/components/home/PromotionSection";

export default function HomePage() {
  // Ngày kết thúc khuyến mãi (30 ngày kể từ ngày hiện tại)
  const promotionEndDate = new Date();
  promotionEndDate.setDate(promotionEndDate.getDate() + 30);
  
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <PromotionSection endDate={promotionEndDate} />
      <CoursePreview />
      <CallToAction />
      <Footer />
      <PromotionPopup endDate={promotionEndDate} />
    </main>
  )
}
