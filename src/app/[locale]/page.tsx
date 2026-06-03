"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Send, Download, ArrowRight, Calendar, Briefcase, GraduationCap, Wrench } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
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

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

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

  const getBio = useCallback(() => {
    if (!profile) return t("hero.subtitle");
    if (locale === "ar" && profile.bioAr) return profile.bioAr;
    if (locale === "en" && profile.bioEn) return profile.bioEn;
    return profile.bio || t("hero.subtitle");
  }, [profile, locale, t]);

  const getTitle = useCallback(() => {
    if (!profile) return t("hero.title");
    if (locale === "ar" && profile.titleAr) return profile.titleAr;
    if (locale === "en" && profile.titleEn) return profile.titleEn;
    return profile.title || t("hero.title");
  }, [profile, locale, t]);

  // Stats
  const yearsExp = experiences.length > 0
    ? Math.max(
        0,
        ...experiences.map((e) => {
          const start = new Date(e.startDate).getFullYear();
          const end = e.current
            ? new Date().getFullYear()
            : e.endDate
            ? new Date(e.endDate).getFullYear()
            : new Date().getFullYear();
          return end - start;
        })
      )
    : 0;

  const statLabels = [
    locale === "fr" ? "Années d'exp." : locale === "ar" ? "سنوات الخبرة" : "Years Exp.",
    locale === "fr" ? "Projets" : locale === "ar" ? "المشاريع" : "Projects",
    locale === "fr" ? "Formations" : locale === "ar" ? "التعليم" : "Education",
    locale === "fr" ? "Compétences" : locale === "ar" ? "المهارات" : "Skills",
  ];

  const stats = [
    { label: statLabels[0], value: Math.max(yearsExp, 3), icon: Calendar, suffix: "+" },
    { label: statLabels[1], value: projects.length, icon: Briefcase, suffix: "+" },
    { label: statLabels[2], value: education.length, icon: GraduationCap, suffix: "" },
    { label: statLabels[3], value: skills.length, icon: Wrench, suffix: "+" },
  ];

  const yearsCount = useCountUp(stats[0].value, 2000);
  const projectsCount = useCountUp(stats[1].value, 2000);
  const eduCount = useCountUp(stats[2].value, 2000);
  const skillsCount = useCountUp(stats[3].value, 2000);
  const counts = [yearsCount, projectsCount, eduCount, skillsCount];

  // Hero animations
  const heroContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded-full flex-shrink-0" />
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
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 lg:py-0 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/[0.02] rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/[0.03] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex-shrink-0"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-[3px] ring-secondary/30 ring-offset-4 ring-offset-background shadow-2xl">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-6xl font-semibold text-primary/30 tracking-tight">
                      {profile?.fullName?.split(" ").map((n: string) => n[0]).join("") || "AH"}
                    </span>
                  </div>
                )}
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-full border border-primary/5 pointer-events-none" />
            </motion.div>

            {/* Hero Content */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left max-w-xl"
            >
              <motion.p
                variants={heroItem}
                className="text-xs font-medium text-secondary tracking-[0.2em] uppercase mb-4"
              >
                {t("hero.greeting")}
              </motion.p>

              <motion.h1
                variants={heroItem}
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tight text-primary leading-[1.05]"
              >
                {profile?.fullName || "Abdenour Hellas"}
              </motion.h1>

              <motion.p
                variants={heroItem}
                className="mt-4 text-lg text-foreground/80 font-medium"
              >
                {getTitle()}
              </motion.p>

              <motion.p
                variants={heroItem}
                className="mt-6 text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                {getBio()}
              </motion.p>

              <motion.div
                variants={heroItem}
                className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <Link
                  href={cvPath}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <FileText size={16} />
                  {t("hero.viewCv")}
                  <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Link>
                <Link
                  href={contactPath}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
                >
                  <Send size={16} />
                  {t("hero.contactMe")}
                </Link>
                {profile?.cvUrl && (
                  <button
                    onClick={handleDownloadCV}
                    className="inline-flex items-center gap-2 px-6 py-3 text-muted-foreground rounded-lg text-sm font-medium hover:text-primary transition-colors"
                  >
                    <Download size={16} />
                    {t("contact.downloadCv")}
                  </button>
                )}
              </motion.div>

              <motion.div variants={heroItem} className="mt-8 flex justify-center lg:justify-start">
                <SocialIcons
                  linkedin={profile?.linkedin}
                  github={profile?.github}
                  twitter={profile?.twitter}
                  facebook={profile?.facebook}
                  instagram={profile?.instagram}
                  whatsapp={profile?.whatsapp}
                  iconSize={18}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-y border-border/60 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                ref={counts[index].ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 mb-3">
                  <stat.icon className="w-5 h-5 text-primary/70" />
                </div>
                <div className="text-3xl font-bold text-primary tabular-nums">
                  {counts[index].count}{stat.suffix}
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HomeNav />

      {/* Experience */}
      <section id="experience" className="py-16 lg:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("experience.title")} subtitle={t("experience.subtitle")} />
          <div className="mt-12">
            <ExperienceSection data={experiences} compact limit={4} />
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("education.title")} subtitle={t("education.subtitle")} />
          <div className="mt-12">
            <EducationSection data={education} compact limit={4} />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-16 lg:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("skills.title")} subtitle={t("skills.subtitle")} />
          <div className="mt-12">
            <SkillsSection data={skills} compact limit={6} />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("projects.title")} subtitle={t("projects.subtitle")} />
          <div className="mt-12">
            <ProjectsSection data={projects} compact limit={4} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 lg:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} />
          <div className="mt-12">
            <TestimonialsSection data={testimonials} compact limit={3} />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />
          <div className="mt-12">
            <BlogSection data={articles} compact limit={3} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/[0.08] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-5xl px-4 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            {t("contact.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-white/70 max-w-xl mx-auto"
          >
            {t("contact.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <Link
              href={contactPath}
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg text-base font-semibold hover:bg-secondary/90 transition-colors shadow-lg shadow-black/20"
            >
              <Send size={18} />
              {t("hero.contactMe")}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
