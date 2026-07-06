"use client";

import { Profile, Experience, Education, Skill, Project } from "@/types";

interface CVPrintTemplateProps {
  profile: Profile | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications?: Education[];
  locale?: "fr" | "en" | "ar";
}

const MONTH_LABELS_FR = ["jan", "fév", "mars", "avr", "mai", "juin", "juill", "août", "sept", "oct", "nov", "déc"];
const MONTH_LABELS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PRESENT_TEXT = { fr: "Présent", en: "Present", ar: "الحاضر" };

const LABELS = {
  fr: {
    profile: "Profil",
    experience: "Expérience professionnelle",
    additionalExperience: "Expérience complémentaire",
    education: "Formation",
    skills: "Compétences",
    languages: "Langues",
    projects: "Projets",
    certifications: "Certifications",
  },
  en: {
    profile: "Professional Summary",
    experience: "Experience",
    additionalExperience: "Additional Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects",
    certifications: "Certifications",
  },
  ar: {
    profile: "الملف الشخصي",
    experience: "الخبرة المهنية",
    additionalExperience: "خبرة إضافية",
    education: "التعليم",
    skills: "الكفاءات",
    languages: "اللغات",
    projects: "المشاريع",
    certifications: "الشهادات",
  },
};

const LANGUAGE_LEVEL = {
  fr: { native: "Natif", fluent: "Courant", professional: "Professionnel", intermediate: "Intermédiaire", beginner: "Débutant" },
  en: { native: "Native", fluent: "Fluent", professional: "Professional", intermediate: "Intermediate", beginner: "Beginner" },
  ar: { native: "اللغة الأم", fluent: "طلاقة", professional: "احترافي", intermediate: "متوسط", beginner: "مبتدئ" },
};

function formatDate(date: string | Date | null | undefined, locale: "fr" | "en" | "ar"): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const labels = locale === "en" ? MONTH_LABELS_EN : MONTH_LABELS_FR;
  return `${labels[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatDateRange(
  start: string | Date,
  end?: string | Date | null,
  current?: boolean,
  locale: "fr" | "en" | "ar" = "fr"
): string {
  const s = formatDate(start, locale);
  const e = current ? PRESENT_TEXT[locale] : formatDate(end, locale);
  return `${s}${e ? ` – ${e}` : ""}`;
}

function formatYearRange(
  start: string | Date,
  end?: string | Date | null,
  current?: boolean,
  locale: "fr" | "en" | "ar" = "fr"
): string {
  if (!start) return "";
  const s = (typeof start === "string" ? new Date(start) : start).getUTCFullYear();
  const e = current ? PRESENT_TEXT[locale] : end ? (typeof end === "string" ? new Date(end) : end).getUTCFullYear() : "";
  return `${s}${e ? ` – ${e}` : ""}`;
}

function toBullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\. (?=[A-ZÀ-ÖØ-öø-ÿ0-9•])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : `${s}.`));
}

function languageLevel(level: number, locale: "fr" | "en" | "ar"): string {
  const labels = LANGUAGE_LEVEL[locale];
  if (level >= 100) return labels.native;
  if (level >= 90) return labels.fluent;
  if (level >= 75) return labels.professional;
  if (level >= 60) return labels.intermediate;
  return labels.beginner;
}

export default function CVPrintTemplate({
  profile,
  experiences,
  education,
  skills,
  projects,
  certifications = [],
  locale = "fr",
}: CVPrintTemplateProps) {
  if (!profile) return null;

  const labels = LABELS[locale];
  const isRTL = locale === "ar";

  const fullName = profile.fullName;
  const title = locale === "en" ? profile.titleEn || profile.title : profile.title;
  const bio = locale === "en" ? profile.bioEn || profile.bio : profile.bio;

  const contacts = [profile.email, profile.phone, profile.location, profile.linkedin, profile.whatsapp].filter(Boolean);

  const mainExperiences = experiences.filter((e) => e.category === "tech").slice(0, 4);
  const additionalExperiences = experiences.filter((e) => e.category !== "tech").slice(0, 3);

  const skillGroups = skills
    .filter((s) => s.category !== "langue")
    .reduce<Record<string, Skill[]>>((acc, s) => {
      const cat = s.categoryEn || s.category;
      acc[cat] = acc[cat] || [];
      acc[cat].push(s);
      return acc;
    }, {});

  const languages = skills.filter((s) => s.category === "langue");

  return (
    <div id="cv-print-content" className="cv-page" style={{ ["--cv-scale" as any]: 1, direction: isRTL ? "rtl" : "ltr" }}>
      <style>{`
        .cv-page {
          width: 210mm;
          min-height: 297mm;
          padding: calc(10mm * var(--cv-scale)) calc(14mm * var(--cv-scale));
          font-family: "Inter", "Calibri", "Segoe UI", sans-serif;
          font-size: calc(9.5pt * var(--cv-scale));
          line-height: 1.35;
          color: #1a1a1a;
          background: #fff;
          box-sizing: border-box;
        }
        .cv-header { text-align: center; margin-bottom: calc(10px * var(--cv-scale)); }
        .cv-name { font-size: calc(24pt * var(--cv-scale)); font-weight: 700; letter-spacing: -0.5px; margin: 0; color: #111; }
        .cv-title { font-size: calc(10.5pt * var(--cv-scale)); font-weight: 500; color: #374151; margin: calc(3px * var(--cv-scale)) 0 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .cv-contacts { font-size: calc(8.5pt * var(--cv-scale)); color: #4b5563; margin: calc(4px * var(--cv-scale)) 0 0; }
        .cv-section { margin-top: calc(8px * var(--cv-scale)); }
        .cv-section-title {
          font-size: calc(9.5pt * var(--cv-scale));
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1a1a1a;
          border-bottom: 1px solid #1a1a1a;
          padding-bottom: calc(3px * var(--cv-scale));
          margin-bottom: calc(6px * var(--cv-scale));
          break-after: avoid;
        }
        .cv-item { break-inside: avoid; }
        .cv-item-title { font-size: calc(9.5pt * var(--cv-scale)); font-weight: 700; color: #1a1a1a; }
        .cv-item-meta { font-size: calc(9pt * var(--cv-scale)); color: #4b5563; font-style: italic; }
        .cv-date { font-size: calc(8.5pt * var(--cv-scale)); color: #6b7280; white-space: nowrap; }
        .cv-text { font-size: calc(9pt * var(--cv-scale)); color: #374151; text-align: justify; }
        .cv-bullets { margin: calc(2px * var(--cv-scale)) 0 0; padding-left: calc(14px * var(--cv-scale)); font-size: calc(9pt * var(--cv-scale)); color: #374151; }
        .cv-bullets li { margin-bottom: calc(1px * var(--cv-scale)); }
        .cv-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
        .cv-skill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: calc(5px * var(--cv-scale)) calc(20px * var(--cv-scale)); }
        .cv-skill-category { font-size: calc(9pt * var(--cv-scale)); font-weight: 600; color: #374151; margin-bottom: calc(1px * var(--cv-scale)); }
        .cv-skill-list { font-size: calc(8.5pt * var(--cv-scale)); color: #4b5563; }
        .cv-lang-list { display: flex; flex-wrap: wrap; gap: calc(10px * var(--cv-scale)); font-size: calc(9pt * var(--cv-scale)); color: #374151; }
        .cv-tech { font-size: calc(8.5pt * var(--cv-scale)); color: #6b7280; margin-top: calc(1px * var(--cv-scale)); }
        .cv-stack { display: flex; flex-direction: column; gap: calc(5px * var(--cv-scale)); }
        .cv-bottom-row { display: flex; gap: calc(16px * var(--cv-scale)); }
        .cv-bottom-col { flex: 1; min-width: 0; }
      `}</style>

      {/* Header */}
      <header className="cv-header">
        <h1 className="cv-name">{fullName}</h1>
        <p className="cv-title">{title}</p>
        <p className="cv-contacts">{contacts.join("  ·  ")}</p>
      </header>

      {/* Profile */}
      {bio && (
        <section className="cv-section">
          <h2 className="cv-section-title">{labels.profile}</h2>
          <p className="cv-text">{bio}</p>
        </section>
      )}

      {/* Main Experience */}
      {mainExperiences.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">{labels.experience}</h2>
          <div className="cv-stack" style={{ gap: "calc(7px * var(--cv-scale))" }}>
            {mainExperiences.map((exp) => (
              <div key={exp.id} className="cv-item">
                <div className="cv-row">
                  <span className="cv-item-title">{locale === "en" ? exp.titleEn || exp.title : exp.title}</span>
                  <span className="cv-date">{formatDateRange(exp.startDate, exp.endDate, exp.current, locale)}</span>
                </div>
                <div className="cv-item-meta">
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </div>
                <ul className="cv-bullets">
                  {toBullets(locale === "en" ? exp.descriptionEn || exp.description : exp.description).slice(0, 3).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Experience */}
      {additionalExperiences.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">{labels.additionalExperience}</h2>
          <div className="cv-stack" style={{ gap: "calc(5px * var(--cv-scale))" }}>
            {additionalExperiences.map((exp) => (
              <div key={exp.id} className="cv-item">
                <div className="cv-row">
                  <span className="cv-item-title">{locale === "en" ? exp.titleEn || exp.title : exp.title}</span>
                  <span className="cv-date">{formatDateRange(exp.startDate, exp.endDate, exp.current, locale)}</span>
                </div>
                <div className="cv-item-meta">
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">{labels.education}</h2>
          <div className="cv-stack" style={{ gap: "calc(5px * var(--cv-scale))" }}>
            {education.slice(0, 4).map((edu) => (
              <div key={edu.id} className="cv-item">
                <div className="cv-row">
                  <span className="cv-item-title">{locale === "en" ? edu.degreeEn || edu.degree : edu.degree}</span>
                  <span className="cv-date">{formatYearRange(edu.startDate, edu.endDate, edu.current, locale)}</span>
                </div>
                <div className="cv-item-meta">
                  {edu.school}{edu.location ? `, ${edu.location}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {Object.keys(skillGroups).length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">{labels.skills}</h2>
          <div className="cv-skill-grid">
            {Object.entries(skillGroups).map(([category, items]) => (
              <div key={category} className="cv-item">
                <div className="cv-skill-category">{category}</div>
                <div className="cv-skill-list">
                  {items.map((s) => (locale === "en" ? s.nameEn || s.name : s.name)).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom row: Languages + Certifications | Projects */}
      {(languages.length > 0 || projects.length > 0 || certifications.length > 0) && (
        <section className="cv-section">
          <div className="cv-bottom-row">
            <div className="cv-bottom-col" style={{ breakInside: "avoid" }}>
              {languages.length > 0 && (
                <>
                  <h2 className="cv-section-title">{labels.languages}</h2>
                  <div className="cv-lang-list" style={{ marginBottom: "calc(10px * var(--cv-scale))" }}>
                    {languages.map((lang) => (
                      <span key={lang.id}>
                        {locale === "en" ? lang.nameEn || lang.name : lang.name} — {languageLevel(lang.level, locale)}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {certifications.length > 0 && (
                <>
                  <h2 className="cv-section-title">{labels.certifications}</h2>
                  <div className="cv-stack" style={{ gap: "calc(5px * var(--cv-scale))" }}>
                    {certifications.slice(0, 2).map((cert) => (
                      <div key={cert.id} className="cv-item">
                        <div className="cv-row">
                          <span className="cv-item-title">{locale === "en" ? cert.degreeEn || cert.degree : cert.degree}</span>
                          <span className="cv-date">{formatDateRange(cert.startDate, cert.endDate, cert.current, locale)}</span>
                        </div>
                        <div className="cv-item-meta">{cert.school}{cert.location ? `, ${cert.location}` : ""}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="cv-bottom-col" style={{ breakInside: "avoid" }}>
              {projects.length > 0 && (
                <>
                  <h2 className="cv-section-title">{labels.projects}</h2>
                  <div className="cv-stack" style={{ gap: "calc(5px * var(--cv-scale))" }}>
                    {projects.slice(0, 2).map((p) => (
                      <div key={p.id} className="cv-item">
                        <div className="cv-item-title">{locale === "en" ? p.titleEn || p.title : p.title}</div>
                        <p className="cv-text" style={{ margin: "calc(1px * var(--cv-scale)) 0 0" }}>
                          {locale === "en" ? p.descriptionEn || p.description : p.description}
                        </p>
                        {p.technologies?.length > 0 && (
                          <div className="cv-tech">{p.technologies.join(" · ")}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
