"use client";

import SectionHeader from "@/components/public/SectionHeader";
import ProjectsSection from "@/components/public/sections/ProjectsSection";
import { useT } from "@/components/public/I18nProvider";

export default function ProjectsPage() {
  const t = useT();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("projects.title")} subtitle={t("projects.subtitle")} />
      <div className="mt-12">
        <ProjectsSection />
      </div>
    </div>
  );
}
