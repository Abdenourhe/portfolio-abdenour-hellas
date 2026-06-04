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

  const languages = skills
    .filter((s: any) => LANGUAGE_NAMES.has(s.name.toLowerCase()))
    .sort((a: any, b: any) => b.level - a.level);

  const techSkills = skills
    .filter((s: any) => !LANGUAGE_NAMES.has(s.name.toLowerCase()))
    .sort((a: any, b: any) => b.level - a.level);

  const featuredProjects = projects.filter((p: any) => p.featured).slice(0, 3);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 print:p-0 print:m-0">
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
          className="relative px-8 py-8 md:px-12 md:py-10 bg-[#1E3A5F] text-white print:px-[18mm] print:py-[12mm]"
          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
        >
          <div className="flex items-center gap-5">
            {profile?.photoUrl && (
              <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#C9A962] overflow-hidden bg-white print:hidden">
                <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-[2.25rem] font-bold tracking-tight leading-none">
                {profile?.fullName || "Abdenour Hellas"}
              </h1>
              <p className="text-base md:text-lg text-[#C9A962] font-semibold mt-1.5">
                {getTitle() || t("hero.title")}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs md:text-sm text-white/90">
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

        {/* Body — screen: grid / print: float sidebar so overflow continues full-width */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] print:block">
          {/* Left sidebar */}
          <aside
            className="px-8 py-8 md:px-10 md:py-10 bg-[#F5F5F0] border-r border-[#E5E5E0] print:float-left print:w-[65mm] print:bg-[#F5F5F0] print:border-r print:border-[#E5E5E0] print:px-[6mm] print:py-[8mm]"
            style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
          >
            {/* Skills */}
            {techSkills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-3 pb-1.5 border-b-2 border-[#C9A962]">
                  {t("cv.skills")}
                </h2>
                <div className="space-y-2">
                  {techSkills.map((skill: any) => (
                    <div key={skill.id} className="break-inside-avoid">
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="font-medium text-[#1E3A5F]">{skill.name}</span>
                        <span className="text-[10px] font-semibold text-[#C9A962]">{skill.level}%</span>
                      </div>
                      <div className="h-1 bg-[#1E3A5F]/10 rounded-full overflow-hidden">
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

            {/* Languages */}
            {languages.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-3 pb-1.5 border-b-2 border-[#C9A962]">
                  {locale === "fr" ? "Langues" : locale === "en" ? "Languages" : "اللغات"}
                </h2>
                <div className="space-y-2">
                  {languages.map((lang: any) => (
                    <div key={lang.id} className="break-inside-avoid">
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="font-medium text-[#1E3A5F]">{lang.name}</span>
                        <span className="text-[10px] font-semibold text-[#C9A962]">{lang.level}%</span>
                      </div>
                      <div className="h-1 bg-[#1E3A5F]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C9A962] rounded-full"
                          style={{ width: `${lang.level}%`, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-3 pb-1.5 border-b-2 border-[#C9A962]">
                  {t("cv.education")}
                </h2>
                <div className="space-y-3">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="break-inside-avoid">
                      <h3 className="font-semibold text-xs text-[#1E3A5F] leading-snug">
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-[#C9A962] font-medium mt-0.5">
                        {edu.school}
                      </p>
                      <p className="text-[10px] text-[#1E3A5F]/60 mt-0.5">
                        {formatDate(edu.startDate, false)} — {edu.current ? t("experience.present") : formatDate(edu.endDate, false)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>

          {/* Right main */}
          <main className="px-8 py-8 md:px-10 md:py-10 print:overflow-hidden print:px-[6mm] print:py-[8mm]">
            {/* Profile */}
            {getBio() && (
              <section className="mb-6 break-inside-avoid">
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-2 pb-1.5 border-b-2 border-[#C9A962]">
                  {t("cv.profile")}
                </h2>
                <p className="text-xs md:text-sm leading-relaxed text-[#333]">
                  {getBio()}
                </p>
              </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-3 pb-1.5 border-b-2 border-[#C9A962]">
                  {t("cv.experience")}
                </h2>
                <div className="space-y-5">
                  {experiences.map((exp: any) => {
                    const bullets = toBullets(exp.description);
                    return (
                      <div key={exp.id} className="break-inside-avoid-page">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5">
                          <h3 className="text-sm font-bold text-[#1E3A5F] leading-tight">
                            {exp.title}
                          </h3>
                          <span className="text-[10px] font-semibold text-[#C9A962] tabular-nums shrink-0">
                            {formatDate(exp.startDate, false)} — {exp.current ? t("experience.present") : formatDate(exp.endDate, false)}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#C9A962] mt-0.5">
                          {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                        </p>
                        {bullets.length > 1 ? (
                          <ul className="mt-2 space-y-1">
                            {bullets.map((b, i) => (
                              <li key={i} className="text-xs text-[#444] leading-relaxed flex items-start gap-2">
                                <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-[#C9A962]" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[#444] mt-1 leading-relaxed">
                            {exp.description}
                          </p>
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
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#1E3A5F] mb-3 pb-1.5 border-b-2 border-[#C9A962]">
                  {t("projects.title")}
                </h2>
                <div className="space-y-3">
                  {featuredProjects.map((project: any) => (
                    <div key={project.id} className="break-inside-avoid-page">
                      <h3 className="text-sm font-bold text-[#1E3A5F] leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#444] mt-1 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.slice(0, 6).map((tech: string) => (
                          <span
                            key={tech}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[#1E3A5F]/5 text-[#1E3A5F] font-medium"
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
