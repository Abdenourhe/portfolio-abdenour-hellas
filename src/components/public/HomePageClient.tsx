"use client";

import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import { Send, Download, ArrowRight, Calendar, Briefcase, GraduationCap, Wrench, MapPin, ZoomIn } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import SocialIcons from "@/components/public/SocialIcons";
import { useT } from "@/components/public/I18nProvider";
import { useLocale, useLocalizedPath } from "@/hooks/useLocale";
import SectionHeader from "@/components/public/SectionHeader";
import TypeWriter from "@/components/public/TypeWriter";
import TypeWriterPhrases from "@/components/public/TypeWriterPhrases";
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

interface HomePageClientProps {
  data: {
    profile: any;
    experiences: any[];
    education: any[];
    skills: any[];
    projects: any[];
    testimonials: any[];
    articles: any[];
    interests: any[];
    homepageSettings: any;
  };
}

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

export default function HomePageClient({ data }: HomePageClientProps) {
  const t = useT();
  const locale = useLocale();
  const contactPath = useLocalizedPath("/contact");

  const profile = data.profile;
  const experiences = data.experiences || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const testimonials = data.testimonials || [];
  const articles = data.articles || [];
  const homepageSettings = data.homepageSettings || null;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleDownloadCV = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
    const cvUrl = profile?.cvUrl || "/cv/Abdenour_Hellas_CV.pdf";
    window.open(cvUrl, "_blank");
  };

  const getBio = useCallback(() => {
    const settingKey = locale === "ar" ? "heroSubtitleAr" : locale === "en" ? "heroSubtitleEn" : "heroSubtitle";
    if (homepageSettings?.[settingKey]) return homepageSettings[settingKey];
    if (!profile) return t("hero.subtitle");
    if (locale === "ar" && profile.bioAr) return profile.bioAr;
    if (locale === "en" && profile.bioEn) return profile.bioEn;
    return profile.bio || t("hero.subtitle");
  }, [profile, locale, t, homepageSettings]);

  const getTitle = useCallback(() => {
    const settingKey = locale === "ar" ? "heroTitleAr" : locale === "en" ? "heroTitleEn" : "heroTitle";
    if (homepageSettings?.[settingKey]) return homepageSettings[settingKey];
    if (!profile) return t("hero.title");
    if (locale === "ar" && profile.titleAr) return profile.titleAr;
    if (locale === "en" && profile.titleEn) return profile.titleEn;
    return profile.title || t("hero.title");
  }, [profile, locale, t, homepageSettings]);

  const getTypewriterPhrases = useCallback(() => {
    const key = locale === "ar" ? "typewriterPhrasesAr" : locale === "en" ? "typewriterPhrasesEn" : "typewriterPhrasesFr";
    const phrases = homepageSettings?.[key];
    if (Array.isArray(phrases) && phrases.length > 0) return phrases;
    return null;
  }, [homepageSettings, locale]);

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

  const statLabels: Record<string, string> = {
    years_exp: locale === "fr" ? "Années d'exp." : locale === "ar" ? "سنوات الخبرة" : "Years Exp.",
    projects: locale === "fr" ? "Projets" : locale === "ar" ? "المشاريع" : "Projects",
    education: locale === "fr" ? "Formations" : locale === "ar" ? "التعليم" : "Education",
    skills: locale === "fr" ? "Compétences" : locale === "ar" ? "المهارات" : "Skills",
    visit: locale === "fr" ? "Visites" : locale === "ar" ? "الزيارات" : "Visits",
    cv_download: locale === "fr" ? "CV téléchargés" : locale === "ar" ? "تحميلات السيرة" : "CV Downloads",
  };

  const statIcons: Record<string, any> = {
    years_exp: Calendar,
    projects: Briefcase,
    education: GraduationCap,
    skills: Wrench,
    visit: null,
    cv_download: null,
  };

  const visibleStatsTypes = homepageSettings?.visibleStatsTypes || ["years_exp", "projects", "education", "skills"];

  const stats = visibleStatsTypes
    .map((type: string) => {
      if (type === "years_exp") {
        return { type, label: statLabels[type], value: Math.max(yearsExp, 3), icon: statIcons[type], suffix: "+" };
      }
      if (type === "projects") {
        return { type, label: statLabels[type], value: projects.length, icon: statIcons[type], suffix: "+" };
      }
      if (type === "education") {
        return { type, label: statLabels[type], value: education.length, icon: statIcons[type], suffix: "" };
      }
      if (type === "skills") {
        return { type, label: statLabels[type], value: skills.length, icon: statIcons[type], suffix: "+" };
      }
      return null;
    })
    .filter(Boolean) as { type: string; label: string; value: number; icon: any; suffix: string }[];

  // Section mapping for dynamic rendering
  const sectionsOrder = homepageSettings?.sectionsOrder || ["stats", "experience", "education", "skills", "projects", "testimonials", "blog"];
  const sectionsVisibility = homepageSettings?.sectionsVisibility || {};

  const sectionComponents: Record<string, { title: string; subtitle: string; component: React.ReactNode; bg?: boolean }> = {
    stats: {
      title: "",
      subtitle: "",
      component: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 dark:bg-secondary/15 mb-3">
                {stat.icon && <stat.icon className="w-5 h-5 text-secondary/80 dark:text-secondary/80" />}
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
      ),
    },
    experience: {
      title: t("experience.title"),
      subtitle: t("experience.subtitle"),
      component: <ExperienceSection data={experiences} />,
    },
    education: {
      title: t("education.title"),
      subtitle: t("education.subtitle"),
      component: <EducationSection data={education} />,
      bg: true,
    },
    skills: {
      title: t("skills.title"),
      subtitle: t("skills.subtitle"),
      component: <SkillsSection data={skills} />,
    },
    projects: {
      title: t("projects.title"),
      subtitle: t("projects.subtitle"),
      component: <ProjectsSection data={projects} featuredIds={homepageSettings?.featuredProjectIds} />,
      bg: true,
    },
    testimonials: {
      title: t("testimonials.title"),
      subtitle: t("testimonials.subtitle"),
      component: <TestimonialsSection data={testimonials} />,
    },
    blog: {
      title: t("blog.title"),
      subtitle: t("blog.subtitle"),
      component: <BlogSection data={articles} />,
      bg: true,
    },
  };

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

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12 md:py-16 lg:py-0 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/[0.08] rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/[0.05] rounded-full blur-3xl" />
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
                className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-[3px] ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl cursor-pointer group"
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
              {/* BADGE VERT DISCRET - seul élément vert vif */}
              <motion.div variants={heroItem} className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#059669]/30 bg-[#ECFDF5]/60 text-[#065F46] dark:text-[#34D399] text-xs tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
                  </span>
                  {locale === "fr" ? "Disponible pour de nouvelles opportunités" : locale === "ar" ? "متاح لفرص جديدة" : "Open to new opportunities"}
                </span>
              </motion.div>

              <motion.p
                variants={heroItem}
                className="text-xl font-medium text-secondary tracking-wider mb-4 font-[family-name:var(--font-comfortaa)]"
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
                {(() => {
                  const phrases = getTypewriterPhrases();
                  if (phrases) {
                    return <TypeWriterPhrases phrases={phrases} delay={700} />;
                  }
                  return <TypeWriter key={getTitle()} text={getTitle()} delay={700} />;
                })()}
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
                  <MapPin size={14} className="text-primary/60" />
                  {profile.location}
                </motion.p>
              )}

              <motion.div
                variants={heroItem}
                className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
              >
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

      {/* Dynamic sections */}
      {sectionsOrder.map((sectionKey: string) => {
        if (sectionsVisibility[sectionKey] === false) return null;
        const section = sectionComponents[sectionKey];
        if (!section) return null;

        const isStats = sectionKey === "stats";
        return (
          <section
            key={sectionKey}
            id={sectionKey}
            className={`${isStats ? "py-10 border-y border-border/60" : "py-20 lg:py-32"} ${
              section.bg ? "bg-card/50 dark:bg-muted/20" : isStats ? "bg-muted/50 dark:bg-muted/50" : ""
            }`}
          >
            <div className="container mx-auto max-w-5xl px-4">
              {!isStats && <SectionHeader title={section.title} subtitle={section.subtitle} />}
              <div className={isStats ? "" : "mt-12"}>{section.component}</div>
            </div>
          </section>
        );
      })}

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
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-[#1E3A5F] rounded-lg text-base font-semibold hover:bg-[#B89A55] transition-colors shadow-lg shadow-black/20"
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