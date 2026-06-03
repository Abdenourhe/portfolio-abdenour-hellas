"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Printer, Globe, Mail, Phone, MapPin } from "lucide-react";
import { useT } from "@/components/public/I18nProvider";
import { useLocale } from "@/components/public/useLocale";

interface CVData {
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  projects: any[];
}

export default function CVPage() {
  const t = useT();
  const locale = useLocale();
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/experiences").then((r) => r.json()),
      fetch("/api/education").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([profile, experiences, education, skills, projects]) => {
        setData({ profile, experiences, education, skills, projects });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
    window.print();
  };

  const formatDate = (date: string | null, current: boolean) => {
    if (current) return t("experience.present");
    if (!date) return "";
    const d = new Date(date);
    const m = d.toLocaleDateString(locale === "fr" ? "fr-CA" : locale === "ar" ? "ar-SA" : "en-US", { month: "short" });
    const y = d.getFullYear();
    return `${m} ${y}`;
  };

  const getBio = () => {
    if (!data?.profile) return "";
    if (locale === "ar" && data.profile.bioAr) return data.profile.bioAr;
    if (locale === "en" && data.profile.bioEn) return data.profile.bioEn;
    return data.profile.bio || "";
  };

  const getTitle = () => {
    if (!data?.profile) return "";
    if (locale === "ar" && data.profile.titleAr) return data.profile.titleAr;
    if (locale === "en" && data.profile.titleEn) return data.profile.titleEn;
    return data.profile.title || "";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <div className="max-w-[210mm] mx-auto animate-pulse space-y-6">
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 text-center">
        <p className="text-muted-foreground">{t("common.error")}</p>
      </div>
    );
  }

  const { profile, experiences, education, skills, projects } = data;

  const topSkills = skills
    .filter((s: any) => s.level >= 80)
    .sort((a: any, b: any) => b.level - a.level)
    .slice(0, 12);

  const featuredProjects = projects
    .filter((p: any) => p.featured)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      {/* Actions — hidden when printing */}
      <div className="max-w-[210mm] mx-auto mb-8 flex flex-wrap justify-center gap-2 print:hidden">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download size={15} />
          {t("cv.download")}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
        >
          <Printer size={15} />
          {t("cv.print")}
        </button>
      </div>

      {/* CV Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[210mm] mx-auto bg-white dark:bg-card text-foreground rounded-xl border border-border shadow-sm print:shadow-none print:border-0 print:rounded-none print:max-w-none print:w-full"
      >
        <div className="p-8 md:p-12 print:p-0">
          {/* Header */}
          <header className="text-center pb-6 mb-6 border-b-2 border-secondary/40">
            <h1 className="text-[2rem] md:text-[2.5rem] font-bold tracking-tight text-primary leading-tight">
              {profile?.fullName || "Abdenour Hellas"}
            </h1>
            <p className="text-base md:text-lg text-secondary font-medium mt-1.5">
              {getTitle() || t("hero.title")}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs md:text-sm text-muted-foreground">
              {profile?.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail size={12} className="text-secondary" />
                  {profile.email}
                </span>
              )}
              {profile?.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={12} className="text-secondary" />
                  {profile.phone}
                </span>
              )}
              {profile?.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-secondary" />
                  {profile.location}
                </span>
              )}
              {profile?.linkedin && (
                <span className="inline-flex items-center gap-1">
                  <Globe size={12} className="text-secondary" />
                  {profile.linkedin.replace(/^https:\/\//, "")}
                </span>
              )}
            </div>
          </header>

          {/* Profile */}
          {getBio() && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary/70 mb-2.5 flex items-center gap-2">
                <span className="w-6 h-px bg-secondary" />
                {t("cv.profile")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                {getBio()}
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary/70 mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-secondary" />
                {t("cv.experience")}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp: any) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                      <h3 className="font-semibold text-sm text-foreground">{exp.title}</h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatDate(exp.startDate, false)} — {exp.current ? t("experience.present") : formatDate(exp.endDate, false)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary font-medium">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary/70 mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-secondary" />
                {t("cv.education")}
              </h2>
              <div className="space-y-4">
                {education.map((edu: any) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                      <h3 className="font-semibold text-sm text-foreground">{edu.degree}</h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatDate(edu.startDate, false)} — {edu.current ? t("experience.present") : formatDate(edu.endDate, false)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary font-medium">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                    {edu.description && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {topSkills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary/70 mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-secondary" />
                {t("cv.skills")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5">
                {topSkills.map((skill: any) => (
                  <div key={skill.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{skill.name}</span>
                    <span className="text-xs text-secondary font-medium tabular-nums">{skill.level}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {featuredProjects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary/70 mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-secondary" />
                {t("projects.title")}
              </h2>
              <div className="space-y-3">
                {featuredProjects.map((project: any) => (
                  <div key={project.id}>
                    <h3 className="font-semibold text-sm text-foreground">{project.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.slice(0, 6).map((tech: string) => (
                        <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/5 text-primary/70">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}
