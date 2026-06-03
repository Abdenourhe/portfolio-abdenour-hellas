"use client";

import SectionHeader from "@/components/public/SectionHeader";
import ExperienceSection from "@/components/public/sections/ExperienceSection";
import { useT } from "@/components/public/I18nProvider";

export default function ExperiencePage() {
  const t = useT();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("experience.title")} subtitle={t("experience.subtitle")} />
      <div className="mt-12">
        <ExperienceSection />
      </div>
    </div>
  );
}
