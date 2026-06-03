"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Send, Download, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import SocialIcons from "@/components/public/SocialIcons";
import { Skeleton } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import { useLocale, useLocalizedPath } from "@/components/public/useLocale";
import SectionHeader from "@/components/public/SectionHeader";
import HomeNav from "@/components/public/HomeNav";
import ExperienceSection from "@/components/public/sections/ExperienceSection";
import EducationSection from "@/components/public/sections/EducationSection";
import SkillsSection from "@/components/public/sections/SkillsSection";
import ProjectsSection from "@/components/public/sections/ProjectsSection";
import TestimonialsSection from "@/components/public/sections/TestimonialsSection";
import BlogSection from "@/components/public/sections/BlogSection";

export default function HomePage() {
  return <HomeClient />;
}

function HomeClient() {
  const t = useT();
  const locale = useLocale();
  const cvPath = useLocalizedPath("/cv");
  const contactPath = useLocalizedPath("/contact");
  const [profile, setProfile] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.profile);
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setTestimonials(data.testimonials || []);
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDownloadCV = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
    if (profile?.cvUrl) {
      window.open(profile.cvUrl, "_blank");
    }
  };

  const getBio = () => {
    if (!profile) return t("hero.subtitle");
    if (locale === "ar" && profile.bioAr) return profile.bioAr;
    if (locale === "en" && profile.bioEn) return profile.bioEn;
    return profile.bio || t("hero.subtitle");
  };

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded-full flex-shrink-0" />
            <div className="text-center lg:text-left space-y-4 max-w-xl w-full">
              <Skeleton className="h-4 w-24 mx-auto lg:mx-0" />
              <Skeleton className="h-16 w-3/4 mx-auto lg:mx-0" />
              <Skeleton className="h-6 w-1/2 mx-auto lg:mx-0" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-3 justify-center lg:justify-start pt-2">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 lg:py-0">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex-shrink-0"
            >
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden ring-1 ring-primary/10 bg-muted">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-semibold text-primary/30 tracking-tight">
                      {profile?.fullName?.split(" ").map((n: string) => n[0]).join("") || "AH"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center lg:text-left max-w-xl"
            >
              <p className="text-xs font-medium text-primary/60 tracking-[0.15em] uppercase mb-4">
                {t("hero.title")}
              </p>
              <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-tight text-primary leading-[1.05]">
                {profile?.fullName || "Abdenour Hellas"}
              </h1>
              <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                {getBio()}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  href={cvPath}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <FileText size={15} />
                  {t("hero.viewCv")}
                  <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Link>
                <Link
                  href={contactPath}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
                >
                  <Send size={15} />
                  {t("hero.contactMe")}
                </Link>
                {profile?.cvUrl && (
                  <button
                    onClick={handleDownloadCV}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-muted-foreground rounded-lg text-sm font-medium hover:text-primary transition-colors"
                  >
                    <Download size={15} />
                    {t("contact.downloadCv")}
                  </button>
                )}
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <SocialIcons
                  linkedin={profile?.linkedin}
                  github={profile?.github}
                  twitter={profile?.twitter}
                  facebook={profile?.facebook}
                  instagram={profile?.instagram}
                  whatsapp={profile?.whatsapp}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <HomeNav />

      {/* Experience */}
      <section id="experience" className="py-16 lg:py-24 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("experience.title")} subtitle={t("experience.subtitle")} />
          <div className="mt-12">
            <ExperienceSection data={experiences} />
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-16 lg:py-24 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("education.title")} subtitle={t("education.subtitle")} />
          <div className="mt-12">
            <EducationSection data={education} />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-16 lg:py-24 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("skills.title")} subtitle={t("skills.subtitle")} />
          <div className="mt-12">
            <SkillsSection data={skills} />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 lg:py-24 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("projects.title")} subtitle={t("projects.subtitle")} />
          <div className="mt-12">
            <ProjectsSection data={projects} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 lg:py-24 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} />
          <div className="mt-12">
            <TestimonialsSection data={testimonials} />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-16 lg:py-24 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />
          <div className="mt-12">
            <BlogSection data={articles} />
          </div>
        </div>
      </section>
    </div>
  );
}
