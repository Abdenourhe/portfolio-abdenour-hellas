"use client";

import SectionHeader from "@/components/public/SectionHeader";
import BlogSection from "@/components/public/sections/BlogSection";
import { useT } from "@/components/public/I18nProvider";

export default function BlogPage() {
  const t = useT();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />
      <div className="mt-12">
        <BlogSection />
      </div>
    </div>
  );
}
