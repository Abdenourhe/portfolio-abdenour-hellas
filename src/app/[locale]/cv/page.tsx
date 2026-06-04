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
    fetch("/api/homepage")
      .then((r) => r.json())
      .then(({ profile, experiences, education, skills, projects }) => {
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
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-96 bg-muted rounded-xl" />
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
    .filter((s: any) => s.level >= 60)
    .sort((a: any, b: any) => b.level - a.level)
    .slice(0, 14);

  const featuredProjects = projects
    .filter((p: any) => p.featured)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      {/* Actions — hidden when printing */}
      <div className="max-w-[210mm] mx-auto mb-8 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download size={16} />
          {t("cv.download")}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
        >
          <Printer size={16} />
          {t("cv.print")}
        </button>
      </div>

      {/* CV Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[210mm] mx-auto bg-white text-foreground rounded-xl border border-border shadow-sm overflow-hidden print:shadow-none print:border-0 print:rounded-none print:max-w-none print:w-full"
      >
        {/* Header */}
        <header
          className="relative px-10 py-10 md:px-14 md:py-12 bg-[#1E3A5F] text-white"
          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
        >
          <div className="flex items-center gap-6">
            {profile?.photoUrl && (
              <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#C9A962] overflow-hidden bg-white">
                <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-none">
                {profile?.fullName || "Abdenour Hellas"}
              </h1>
              <p className="text-lg md:text-xl text-[#C9A962] font-semibold mt-2">
                {getTitle() || t("hero.title")}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-sm text-white/90">
                {profile?.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} className="text-[#C9A962]" />
                    {profile.email}
                  </span>
                )}
                {profile?.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={14} className="text-[#C9A962]" />
                    {profile.phone}
                  </span>
                )}
                {profile?.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#C9A962]" />
                    {profile.location}
                  </span>
                )}
                {profile?.linkedin && (
                  <span className="inline-flex items-center gap-1.5">
                    <Globe size={14} className="text-[#C9A962]" />
                    {profile.linkedin.replace(/^https?:\/\//, "")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] print:grid-cols-[280px_1fr]">
          {/* Left sidebar */}
          <aside
            className="px-8 py-10 md:px-10 md:py-12 bg-[#F5F5F0] border-r border-[#E5E5E0]"
            style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
          >
            {/* Skills */}
            {topSkills.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-4 pb-2 border-b-2 border-[#C9A962]">
                  {t("cv.skills")}
                </h2>
                <div className="space-y-3">
                  {topSkills.map((skill: any) => (
                    <div key={skill.id} className="break-inside-avoid">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-[#1E3A5F]">{skill.name}</span>
                        <span className="text-xs font-semibold text-[#C9A962]">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1E3A5F]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C9A962] rounded-full"
                          style={{ width: `${skill.level}%`, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-4 pb-2 border-b-2 border-[#C9A962]">
                  {t("cv.education")}
                </h2>
                <div className="space-y-5">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="break-inside-avoid">
                      <h3 className="font-semibold text-sm text-[#1E3A5F] leading-snug">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-[#C9A962] font-medium mt-0.5">
                        {edu.school}
                      </p>
                      <p className="text-xs text-[#1E3A5F]/60 mt-1">
                        {formatDate(edu.startDate, false)} — {edu.current ? t("experience.present") : formatDate(edu.endDate, false)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages (if any in bio or we can infer) — skipping for now */}
          </aside>

          {/* Right main */}
          <main className="px-8 py-10 md:px-12 md:py-12">
            {/* Profile */}
            {getBio() && (
              <section className="mb-8 break-inside-avoid">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-3 pb-2 border-b-2 border-[#C9A962] flex items-center gap-2">
                  {t("cv.profile")}
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-[#333]">
                  {getBio()}
                </p>
              </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-4 pb-2 border-b-2 border-[#C9A962]">
                  {t("cv.experience")}
                </h2>
                <div className="space-y-6">
                  {experiences.map((exp: any) => (
                    <div key={exp.id} className="break-inside-avoid">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <h3 className="text-base font-bold text-[#1E3A5F] leading-tight">
                          {exp.title}
                        </h3>
                        <span className="text-xs font-semibold text-[#C9A962] tabular-nums shrink-0 mt-0.5">
                          {formatDate(exp.startDate, false)} — {exp.current ? t("experience.present") : formatDate(exp.endDate, false)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#C9A962] mt-1">
                        {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                      </p>
                      <p className="text-sm text-[#444] mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {featuredProjects.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-4 pb-2 border-b-2 border-[#C9A962]">
                  {t("projects.title")}
                </h2>
                <div className="space-y-5">
                  {featuredProjects.map((project: any) => (
                    <div key={project.id} className="break-inside-avoid">
                      <h3 className="text-base font-bold text-[#1E3A5F] leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#444] mt-1.5 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.slice(0, 8).map((tech: string) => (
                          <span
                            key={tech}
                            className="text-[11px] px-2 py-0.5 rounded bg-[#1E3A5F]/5 text-[#1E3A5F] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
}
