"use client";

import SectionHeader from "@/components/public/SectionHeader";
import TestimonialsSection from "@/components/public/sections/TestimonialsSection";
import { useT } from "@/components/public/I18nProvider";

export default function TestimonialsPage() {
  const t = useT();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} />
      <div className="mt-12">
        <TestimonialsSection />
      </div>
    </div>
  );
}
