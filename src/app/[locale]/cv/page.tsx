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
  interests: any[];
}

function toBullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\. (?=[A-ZÀ-ÖØ-öø-ÿ0-9])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : s + "."));
}

const LANGUAGE_NAMES = new Set([
  "français",
  "arabe",
  "anglais",
  "english",
  "french",
  "arabic",
  "espagnol",
  "spanish",
]);

export default function CVPage() {
  const t = useT();
  const locale = useLocale();
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then(({ profile, experiences, education, skills, projects, interests }) => {
        setData({ profile, experiences, education, skills, projects, interests });
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

  const { profile, experiences, education, skills, projects, interests } = data;

  const languages = skills
    .filter((s: any) => LANGUAGE_NAMES.has(s.name.toLowerCase()))
    .sort((a: any, b: any) => b.level - a.level);

  const techSkills = skills
    .filter((s: any) => !LANGUAGE_NAMES.has(s.name.toLowerCase()))
    .sort((a: any, b: any) => b.level - a.level);

  const featuredProjects = projects.filter((p: any) => p.featured).slice(0, 3);

  const otherTitles = ["caissière", "service omni", "préposé"];
  const mainExperiences = experiences.filter(
    (e: any) => !otherTitles.some((ot) => e.title.toLowerCase().includes(ot))
  );
  const otherExperiences = experiences.filter(
    (e: any) => otherTitles.some((ot) => e.title.toLowerCase().includes(ot))
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 md:py-28 print:p-0 print:m-0">
      {/* Actions — hidden when printing */}
      <div className="max-w-[210mm] mx-auto mb-6 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors min-h-[48px]"
        >
          <Download size={16} />
          {t("cv.download")}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-3 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.02] transition-colors min-h-[48px]"
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
        className="max-w-[210mm] mx-auto bg-white dark:bg-card text-foreground rounded-xl border border-border shadow-sm overflow-hidden print:shadow-none print:border-0 print:rounded-none print:max-w-none print:w-full"
      >
        {/* Header */}
        <header
          className="relative px-5 py-5 md:px-12 md:py-8 bg-[#1E3A5F] text-white dark:bg-[#152A45] print:px-[18mm] print:py-[8mm]"
          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
        >
          <div className="flex items-center gap-4 md:gap-5">
            {profile?.photoUrl && (
              <div className="shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-[#C9A962] overflow-hidden bg-white dark:bg-card print:hidden">
                <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-[2.25rem] font-bold tracking-tight leading-none">
                {profile?.fullName || "Abdenour Hellas"}
              </h1>
              <p className="text-sm md:text-lg text-[#C9A962] font-semibold mt-1">
                {getTitle() || t("hero.title")}
              </p>
              <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 mt-2 text-xs md:text-sm text-white/90">
                {profile?.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail size={13} className="text-[#C9A962]" />
                    {profile.email}
                  </span>
                )}
                {profile?.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone size={13} className="text-[#C9A962]" />
                    {profile.phone}
                  </span>
                )}
                {profile?.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} className="text-[#C9A962]" />
                    {profile.location}
                  </span>
                )}
                {profile?.linkedin && (
                  <span className="inline-flex items-center gap-1">
                    <Globe size={13} className="text-[#C9A962]" />
                    {profile.linkedin.replace(/^https?:\/\//, "")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] print:block">
          {/* Left sidebar */}
          <aside
            className="px-5 py-6 md:px-10 md:py-10 bg-[#F5F5F0] dark:bg-muted border-r-0 md:border-r border-[#E5E5E0] dark:border-border print:float-left print:w-[65mm] print:bg-[#F5F5F0] print:border-r print:border-[#E5E5E0] print:px-[6mm] print:py-[8mm]"
            style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
          >
            {/* Skills */}
            {techSkills.length > 0 && (
              <section className="mb-6 md:mb-8 print:mb-4">
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-3 pb-2 border-b border-[#C9A962]">
                  {t("cv.skills")}
                </h2>
                <div className="space-y-3">
                  {Array.from(new Map(techSkills.map((s: any) => [s.category, s])).entries())
                    .map(([cat]: [string, any]) => cat)
                    .filter(Boolean)
                    .map((cat: string) => {
                      const catSkills = techSkills.filter((s: any) => s.category === cat);
                      return (
                        <div key={cat} className="break-inside-avoid">
                          <h3 className="text-xs md:text-[10px] font-bold uppercase tracking-wider text-[#1E3A5F]/70 dark:text-foreground/70 mb-1.5">
                            {cat}
                          </h3>
                          <div className="space-y-1.5">
                            {catSkills.map((skill: any) => (
                              <div key={skill.id}>
                                <div className="flex items-center justify-between text-sm md:text-xs mb-0.5">
                                  <span className="text-[#1E3A5F] dark:text-foreground font-medium">{skill.name}</span>
                                  <span className="text-xs md:text-[10px] font-semibold text-[#C9A962]">{skill.level}%</span>
                                </div>
                                <div className="h-1.5 md:h-1 bg-[#1E3A5F]/10 dark:bg-foreground/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#C9A962] rounded-full"
                                    style={{ width: `${skill.level}%`, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section className="mb-6 md:mb-8 print:mb-4">
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-3 pb-2 border-b border-[#C9A962]">
                  {locale === "fr" ? "Langues" : locale === "en" ? "Languages" : "اللغات"}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((lang: any) => (
                    <span
                      key={lang.id}
                      className="inline-block text-xs md:text-[10px] px-2 py-0.5 rounded-sm border border-[#1E3A5F]/30 dark:border-foreground/30 text-[#1E3A5F] dark:text-foreground font-medium"
                    >
                      {lang.name} · {lang.level}%
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="mb-6 md:mb-8 print:mb-4">
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-3 pb-2 border-b border-[#C9A962]">
                  {t("cv.education")}
                </h2>
                <div className="space-y-4 print:space-y-3">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="break-inside-avoid">
                      <h3 className="font-bold text-sm md:text-xs text-[#1E3A5F] dark:text-foreground leading-snug">
                        {edu.degree}
                      </h3>
                      <p className="text-sm md:text-xs text-[#C9A962] font-semibold mt-0.5">
                        {edu.school}{edu.location ? ` — ${edu.location}` : ""}
                      </p>
                      <p className="text-xs md:text-[10px] text-[#1E3A5F]/50 dark:text-foreground/50 mt-0.5">
                        {formatDate(edu.startDate, false)} — {edu.current ? t("experience.present") : formatDate(edu.endDate, false)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Interests */}
            {interests && interests.length > 0 && (
              <section>
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-3 pb-2 border-b border-[#C9A962]">
                  {locale === "fr" ? "Centres d'intérêt" : locale === "en" ? "Interests" : "الاهتمامات"}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((interest: any) => (
                    <span
                      key={interest.id}
                      className="inline-block text-xs md:text-[10px] px-2 py-0.5 rounded-sm bg-[#C9A962]/20 dark:bg-secondary/20 text-[#1E3A5F] dark:text-foreground font-medium"
                      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>

          {/* Right main */}
          <main className="px-5 py-6 md:px-10 md:py-10 print:overflow-hidden print:px-[6mm] print:py-[8mm]">
            {/* Profile */}
            {getBio() && (
              <section className="mb-6 md:mb-8 break-inside-avoid">
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-3 pb-2 border-b border-[#C9A962]">
                  {t("cv.profile")}
                </h2>
                <p className="text-base md:text-sm leading-relaxed text-foreground">
                  {getBio()}
                </p>
              </section>
            )}

            {/* Experience — Main */}
            {mainExperiences.length > 0 && (
              <section className="mb-6 md:mb-8 print:mb-4">
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-4 pb-2 border-b border-[#C9A962]">
                  {t("cv.experience")}
                </h2>
                <div className="space-y-6 print:space-y-3">
                  {mainExperiences.map((exp: any) => {
                    const bullets = toBullets(exp.description);
                    return (
                      <div key={exp.id}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5">
                          <h3 className="text-base md:text-[15px] font-bold text-[#1E3A5F] dark:text-foreground leading-tight">
                            {exp.title}
                          </h3>
                          <span className="text-xs md:text-[11px] text-[#1E3A5F]/40 dark:text-foreground/40 tabular-nums shrink-0 font-medium">
                            {formatDate(exp.startDate, false)} — {exp.current ? t("experience.present") : formatDate(exp.endDate, false)}
                          </span>
                        </div>
                        <p className="text-sm md:text-[13px] font-semibold text-[#C9A962] mt-1">
                          {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                        </p>
                        {bullets.length > 1 ? (
                          <ul className="mt-2.5 space-y-1.5">
                            {bullets.map((b, i) => (
                              <li key={i} className="text-sm md:text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                                <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-[#C9A962]" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm md:text-xs text-muted-foreground mt-2 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Experience — Other (compact) */}
            {otherExperiences.length > 0 && (
              <section className="mb-6 md:mb-8 print:mb-4">
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-3 pb-2 border-b border-[#C9A962]">
                  {locale === "fr" ? "Autres expériences" : locale === "en" ? "Other Experience" : "خبرات أخرى"}
                </h2>
                <div className="space-y-4 print:space-y-3">
                  {otherExperiences.map((exp: any) => {
                    const bullets = toBullets(exp.description);
                    return (
                      <div key={exp.id}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                          <p className="text-sm md:text-xs font-semibold text-[#1E3A5F] dark:text-foreground">
                            {exp.title} — <span className="text-[#C9A962]">{exp.company}</span>
                          </p>
                          <span className="text-xs md:text-[10px] text-[#1E3A5F]/40 dark:text-foreground/40 tabular-nums shrink-0">
                            {formatDate(exp.startDate, false)} — {exp.current ? t("experience.present") : formatDate(exp.endDate, false)}
                          </span>
                        </div>
                        {bullets.length > 1 ? (
                          <ul className="mt-2 space-y-1">
                            {bullets.map((b, i) => (
                              <li key={i} className="text-sm md:text-xs text-[#444] dark:text-foreground/80 leading-relaxed flex items-start gap-2">
                                <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-[#C9A962]" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm md:text-xs text-muted-foreground mt-1 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Projects */}
            {featuredProjects.length > 0 && (
              <section>
                <h2 className="text-sm md:text-xs font-bold uppercase tracking-[0.14em] text-[#1E3A5F] dark:text-foreground mb-4 pb-2 border-b border-[#C9A962]">
                  {t("projects.title")}
                </h2>
                <div className="space-y-4 print:space-y-3">
                  {featuredProjects.map((project: any) => (
                    <div key={project.id}>
                      <h3 className="text-base md:text-[15px] font-bold text-[#1E3A5F] dark:text-foreground leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm md:text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.slice(0, 6).map((tech: string) => (
                          <span
                            key={tech}
                            className="text-xs md:text-[10px] px-1.5 py-0.5 rounded-sm bg-[#1E3A5F]/5 dark:bg-foreground/10 text-[#1E3A5F] dark:text-foreground font-medium"
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
