"use client";

import SectionHeader from "@/components/public/SectionHeader";
import SkillsSection from "@/components/public/sections/SkillsSection";
import { useT } from "@/components/public/I18nProvider";

export default function SkillsPage() {
  const t = useT();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("skills.title")} subtitle={t("skills.subtitle")} />
      <div className="mt-12">
        <SkillsSection />
      </div>
    </div>
  );
}
