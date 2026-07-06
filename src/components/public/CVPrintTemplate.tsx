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

  const containerStyle: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    padding: "12mm 16mm",
    fontFamily: '"Inter", "Calibri", "Segoe UI", sans-serif',
    fontSize: "9.5pt",
    lineHeight: 1.35,
    color: "#1a1a1a",
    background: "#fff",
    boxSizing: "border-box",
    direction: isRTL ? "rtl" : "ltr",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "9.5pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#1a1a1a",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "3px",
    marginBottom: "6px",
    marginTop: "10px",
  };

  const itemTitleStyle: React.CSSProperties = {
    fontSize: "9.5pt",
    fontWeight: 700,
    color: "#1a1a1a",
  };

  const itemMetaStyle: React.CSSProperties = {
    fontSize: "9pt",
    color: "#4b5563",
    fontStyle: "italic",
  };

  const dateStyle: React.CSSProperties = {
    fontSize: "8.5pt",
    color: "#6b7280",
    whiteSpace: "nowrap",
  };

  const textStyle: React.CSSProperties = {
    fontSize: "9pt",
    color: "#374151",
    textAlign: "justify",
  };

  return (
    <div id="cv-print-content" style={containerStyle}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "24pt", fontWeight: 700, letterSpacing: "-0.5px", margin: 0, color: "#111" }}>
          {fullName}
        </h1>
        <p style={{ fontSize: "10.5pt", fontWeight: 500, color: "#374151", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </p>
        <p style={{ fontSize: "8.5pt", color: "#4b5563", margin: "4px 0 0" }}>
          {contacts.join("  ·  ")}
        </p>
      </header>

      {/* Profile */}
      {bio && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.profile}</h2>
          <p style={textStyle}>{bio}</p>
        </section>
      )}

      {/* Main Experience */}
      {mainExperiences.length > 0 && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.experience}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {mainExperiences.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={itemTitleStyle}>{locale === "en" ? exp.titleEn || exp.title : exp.title}</span>
                  <span style={dateStyle}>{formatDateRange(exp.startDate, exp.endDate, exp.current, locale)}</span>
                </div>
                <div style={itemMetaStyle}>
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </div>
                <ul style={{ margin: "2px 0 0", paddingLeft: isRTL ? 0 : "14px", paddingRight: isRTL ? "14px" : 0, fontSize: "9pt", color: "#374151" }}>
                  {toBullets(locale === "en" ? exp.descriptionEn || exp.description : exp.description).slice(0, 3).map((b, i) => (
                    <li key={i} style={{ marginBottom: "1px" }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Experience */}
      {additionalExperiences.length > 0 && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.additionalExperience}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {additionalExperiences.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={itemTitleStyle}>{locale === "en" ? exp.titleEn || exp.title : exp.title}</span>
                  <span style={dateStyle}>{formatDateRange(exp.startDate, exp.endDate, exp.current, locale)}</span>
                </div>
                <div style={itemMetaStyle}>
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.education}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {education.slice(0, 4).map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={itemTitleStyle}>{locale === "en" ? edu.degreeEn || edu.degree : edu.degree}</span>
                  <span style={dateStyle}>{formatYearRange(edu.startDate, edu.endDate, edu.current, locale)}</span>
                </div>
                <div style={itemMetaStyle}>
                  {edu.school}{edu.location ? `, ${edu.location}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {Object.keys(skillGroups).length > 0 && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.skills}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 20px" }}>
            {Object.entries(skillGroups).map(([category, items]) => (
              <div key={category}>
                <div style={{ fontSize: "9pt", fontWeight: 600, color: "#374151", marginBottom: "1px" }}>
                  {category}
                </div>
                <div style={{ fontSize: "8.5pt", color: "#4b5563" }}>
                  {items.map((s) => (locale === "en" ? s.nameEn || s.name : s.name)).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.languages}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: "9pt", color: "#374151" }}>
                {locale === "en" ? lang.nameEn || lang.name : lang.name} — {languageLevel(lang.level, locale)}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.projects}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {projects.slice(0, 2).map((p) => (
              <div key={p.id}>
                <div style={itemTitleStyle}>{locale === "en" ? p.titleEn || p.title : p.title}</div>
                <p style={{ ...textStyle, margin: "1px 0 0" }}>
                  {locale === "en" ? p.descriptionEn || p.description : p.description}
                </p>
                {p.technologies?.length > 0 && (
                  <div style={{ fontSize: "8.5pt", color: "#6b7280", marginTop: "1px" }}>
                    {p.technologies.join(" · ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 style={sectionTitleStyle}>{labels.certifications}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {certifications.slice(0, 2).map((cert) => (
              <div key={cert.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={itemTitleStyle}>{locale === "en" ? cert.degreeEn || cert.degree : cert.degree}</span>
                  <span style={dateStyle}>{formatDateRange(cert.startDate, cert.endDate, cert.current, locale)}</span>
                </div>
                <div style={itemMetaStyle}>{cert.school}{cert.location ? `, ${cert.location}` : ""}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
