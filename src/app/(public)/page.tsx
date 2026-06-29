import HeroSection from "@/components/home/HeroSection";
import PackagePreviewSection from "@/components/home/PackagePreviewSection";
import PainSection from "@/components/home/PainSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import CTASection from "@/components/home/CTASection";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Client avatars for the hero's "100+ happy clients" badge — sourced from
  // the testimonials managed in the admin panel (only those with a photo).
  const heroAvatars = await prisma.testimonial.findMany({
    where: { avatar: { not: null } },
    orderBy: { order: "asc" },
    take: 4,
    select: { id: true, name: true, avatar: true },
  });

  return (
    <>
      <HeroSection avatars={heroAvatars} />
      <PackagePreviewSection />
      <PainSection />
      <SolutionsSection />
      <WhyChooseSection />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
