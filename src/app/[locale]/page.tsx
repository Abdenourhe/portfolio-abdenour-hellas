"use client";

import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import { FileText, Send, Download, ArrowRight, Calendar, Briefcase, GraduationCap, Wrench, MapPin, ZoomIn } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import SocialIcons from "@/components/public/SocialIcons";
import { Skeleton } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import { useLocale, useLocalizedPath } from "@/components/public/useLocale";
import SectionHeader from "@/components/public/SectionHeader";
import TypeWriter from "@/components/public/TypeWriter";
import OscilloscopeWave from "@/components/public/OscilloscopeWave";
import ElectricHalo from "@/components/public/ElectricHalo";
import MagneticButton from "@/components/public/MagneticButton";
import ImageLightbox from "@/components/public/ImageLightbox";
import ExperienceSection from "@/components/public/sections/ExperienceSection";
import EducationSection from "@/components/public/sections/EducationSection";
import SkillsSection from "@/components/public/sections/SkillsSection";
import ProjectsSection from "@/components/public/sections/ProjectsSection";
import TestimonialsSection from "@/components/public/sections/TestimonialsSection";
import BlogSection from "@/components/public/sections/BlogSection";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [count, setCount] = useState(value);

  useEffect(() => {
    if (!isInView || value <= 0) {
      setCount(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
      <section className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12 md:py-16 lg:py-0 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/[0.08] rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/[0.10] rounded-full blur-3xl" />
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
              <ElectricHalo />
              <div
                className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-[3px] ring-secondary/30 ring-offset-4 ring-offset-background shadow-2xl cursor-pointer group"
                onClick={() => profile?.photoUrl && setLightboxOpen(true)}
              >
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-6xl font-semibold text-primary/30 tracking-tight">
                      {profile?.fullName?.split(" ").map((n: string) => n[0]).join("") || "AH"}
                    </span>
                  </div>
                )}
                {profile?.photoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-full bg-black/40 text-white backdrop-blur-sm">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                )}
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-full border border-primary/20 pointer-events-none" />
            </motion.div>

            {/* Hero Content */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left max-w-xl"
            >
              {/* BADGE CORRIGE - utilise secondary/10 au lieu de #E0F3E4 */}
              <motion.div variants={heroItem} className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                  </span>
                  {locale === "fr" ? "Disponible pour de nouvelles opportunités" : locale === "ar" ? "متاح لفرص جديدة" : "Open to new opportunities"}
                </span>
              </motion.div>

              <motion.p
                variants={heroItem}
                className="text-xs font-medium text-secondary tracking-[0.2em] uppercase mb-4"
              >
                {t("hero.greeting")}
              </motion.p>

              <motion.h1
                variants={heroItem}
                className="font-[family-name:var(--font-serif)] text-[clamp(2.8rem,6.5vw,5rem)] font-medium tracking-[0.01em] text-primary leading-[1.1]"
              >
                {profile?.fullName || "Abdenour Hellas"}
              </motion.h1>

              <motion.div variants={heroItem} className="mt-5 text-base md:text-lg text-foreground font-light min-h-[1.75rem] tracking-wide">
                <TypeWriter key={getTitle()} text={getTitle()} delay={700} />
              </motion.div>

              <motion.p
                variants={heroItem}
                className="mt-8 text-sm md:text-base text-foreground/80 leading-[1.8] max-w-md mx-auto lg:mx-0"
              >
                {getBio()}
              </motion.p>

              {profile?.location && (
                <motion.p
                  variants={heroItem}
                  className="mt-3 text-sm text-muted-foreground flex items-center gap-1.5 justify-center lg:justify-start"
                >
                  <MapPin size={14} className="text-secondary" />
                  {profile.location}
                </motion.p>
              )}

              <motion.div
                variants={heroItem}
                className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <MagneticButton>
                  <Link
                    href={cvPath}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-[0.8rem] tracking-wide font-normal hover:bg-primary/90 transition-colors"
                  >
                    <FileText size={16} />
                    {t("hero.viewCv")}
                    <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href={contactPath}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg text-[0.8rem] tracking-wide font-normal hover:border-primary/30 hover:bg-primary/[0.06] transition-colors"
                  >
                    <Send size={16} />
                    {t("hero.contactMe")}
                  </Link>
                </MagneticButton>
                {profile?.cvUrl && (
                  <button
                    onClick={handleDownloadCV}
                    className="inline-flex items-center gap-2 px-6 py-3 text-muted-foreground rounded-lg text-[0.8rem] tracking-wide font-normal hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary"
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
                  iconSize={22}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
        {/* Oscilloscope wave transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <OscilloscopeWave />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-y border-border/60 bg-muted/50">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/15 mb-3">
                  <stat.icon className="w-5 h-5 text-primary/70" />
                </div>
                <div className="text-3xl font-bold text-primary tabular-nums">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20 lg:py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("experience.title")} subtitle={t("experience.subtitle")} />
          <div className="mt-12">
            <ExperienceSection data={experiences} />
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-20 lg:py-32 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("education.title")} subtitle={t("education.subtitle")} />
          <div className="mt-12">
            <EducationSection data={education} />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20 lg:py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("skills.title")} subtitle={t("skills.subtitle")} />
          <div className="mt-12">
            <SkillsSection data={skills} />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 lg:py-32 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("projects.title")} subtitle={t("projects.subtitle")} />
          <div className="mt-12">
            <ProjectsSection data={projects} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} />
          <div className="mt-12">
            <TestimonialsSection data={testimonials} />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 lg:py-32 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />
          <div className="mt-12">
            <BlogSection data={articles} />
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

      <ImageLightbox
        src={profile?.photoUrl || ""}
        alt={profile?.fullName || "Photo"}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}