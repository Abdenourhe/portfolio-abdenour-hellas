"use client";

import SectionHeader from "@/components/public/SectionHeader";
import EducationSection from "@/components/public/sections/EducationSection";
import { useT } from "@/components/public/I18nProvider";

export default function EducationPage() {
  const t = useT();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("education.title")} subtitle={t("education.subtitle")} />
      <div className="mt-12">
        <EducationSection />
      </div>
    </div>
  );
}
