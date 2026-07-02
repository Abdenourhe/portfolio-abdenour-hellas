"use client";

import { Profile, Experience, Education, Skill, Project } from "@/types";

interface CVPrintTemplateProps {
  profile: Profile | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications?: Education[];
}

const THEME = {
  primary: "#1e3a5f",
  text: "#1f2937",
  muted: "#4b5563",
  border: "#d1d5db",
  bg: "#ffffff",
};

function toBullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\. (?=[A-ZÀ-ÖØ-öø-ÿ0-9•])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : s + "."));
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-CA", { month: "short", year: "numeric", timeZone: "UTC" });
}

function formatDateRange(start: string | Date, end?: string | Date | null, current?: boolean): string {
  const s = formatDate(start);
  const e = current ? "Présent" : formatDate(end);
  return `${s} ${e ? `— ${e}` : ""}`;
}

function formatYearRange(start: string | Date, end?: string | Date | null, current?: boolean): string {
  if (!start) return "";
  const s = (typeof start === "string" ? new Date(start) : start).getUTCFullYear();
  const e = current ? "Présent" : end ? (typeof end === "string" ? new Date(end) : end).getUTCFullYear() : "";
  return `${s}${e ? ` — ${e}` : ""}`;
}

function formatExperienceRange(start: string | Date, end?: string | Date | null, current?: boolean): string {
  if (!start) return "";
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = end ? (typeof end === "string" ? new Date(end) : end) : null;
  const durationYears = endDate
    ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    : current
    ? Infinity
    : 0;
  if (durationYears > 2.5 && !current) {
    return formatYearRange(start, end, current);
  }
  return formatDateRange(start, end, current);
}

function languageLevel(level: number): string {
  if (level >= 100) return "Natif";
  if (level >= 90) return "Courant";
  if (level >= 75) return "Professionnel";
  if (level >= 60) return "Intermédiaire";
  return "Débutant";
}

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  électrique: "Techniques",
  normes: "Normes",
  web: "Développement web",
  logiciel: "Logiciels",
  soft: "Soft skills",
};

export default function CVPrintTemplate({
  profile,
  experiences,
  education,
  skills,
  projects,
  certifications = [],
}: CVPrintTemplateProps) {
  if (!profile) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: THEME.muted }}>
        Aucun profil trouvé.
      </div>
    );
  }

  const skillGroups = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const languages = skillGroups["langue"] || [];
  const skillCategories = ["électrique", "normes", "web", "logiciel", "soft"].filter(
    (cat) => skillGroups[cat]?.length
  );

  return (
    <div
      id="cv-print-content"
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        padding: "8mm 10mm 8mm 10mm",
        fontFamily: '"Inter", "Calibri", "Segoe UI", sans-serif',
        fontSize: "8.5pt",
        lineHeight: 1.1,
        color: THEME.text,
        backgroundColor: THEME.bg,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: `1.5px solid ${THEME.primary}`, paddingBottom: "4px", marginBottom: "5px" }}>
        <h1
          style={{
            fontSize: "17pt",
            fontWeight: 800,
            color: THEME.primary,
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {profile.fullName}
        </h1>
        <p
          style={{
            fontSize: "9.5pt",
            fontWeight: 600,
            color: THEME.primary,
            margin: "1px 0 0 0",
            opacity: 0.9,
          }}
        >
          {profile.title}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "2px",
            fontSize: "7.5pt",
            color: THEME.muted,
          }}
        >
          <span>{profile.email}</span>
          <span>{profile.phone}</span>
          <span>{profile.location}</span>
          <span>{profile.linkedin?.replace(/^https?:\/\/(www\.)?/, "")}</span>
          <span>abdenour-hellas.online</span>
        </div>
      </header>

      {/* Profile */}
      <section style={{ marginBottom: "7px" }}>
        <SectionTitle>Profil</SectionTitle>
        <p style={{ textAlign: "justify", margin: 0, fontSize: "8pt", color: THEME.text }}>
          {profile.bio}
        </p>
      </section>

      {/* Experiences */}
      {experiences.length > 0 && (
        <section style={{ marginBottom: "7px" }}>
          <SectionTitle>Expériences professionnelles</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                    {exp.title}
                  </span>
                  <span
                    style={{
                      fontSize: "7.5pt",
                      color: THEME.muted,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatExperienceRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div style={{ fontSize: "8pt", fontWeight: 600, color: THEME.muted, marginBottom: "0.5px" }}>
                  {exp.company} — {exp.location}
                </div>
                <BulletList items={toBullets(exp.description)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two columns */}
      <div style={{ display: "flex", gap: "8px" }}>
        {/* Left column */}
        <div style={{ width: "80mm", flexShrink: 0 }}>
          {/* Skills */}
          {skillCategories.length > 0 && (
            <section style={{ marginBottom: "5px" }}>
              <SectionTitle>Compétences</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {skillCategories.map((cat) => (
                  <div key={cat}>
                    <div
                      style={{
                        fontSize: "7.5pt",
                        fontWeight: 700,
                        color: THEME.primary,
                        textTransform: "uppercase",
                        marginBottom: "0.5px",
                      }}
                    >
                      {SKILL_CATEGORY_LABELS[cat] || cat}
                    </div>
                    <div style={{ fontSize: "8pt", color: THEME.text, textAlign: "justify" }}>
                      {skillGroups[cat].map((s) => s.name).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section style={{ marginBottom: "5px" }}>
              <SectionTitle>Langues</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5px" }}>
                {languages.map((lang) => (
                  <div
                    key={lang.id}
                    style={{ display: "flex", justifyContent: "space-between", fontSize: "8pt", color: THEME.text }}
                  >
                    <span>{lang.name}</span>
                    <span>
                      {lang.level}% — {languageLevel(lang.level)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1 }}>
          {/* Education */}
          {education.length > 0 && (
            <section style={{ marginBottom: "5px" }}>
              <SectionTitle>Formation</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                        {edu.degree}
                      </span>
                      <span style={{ fontSize: "7.5pt", color: THEME.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
                        {formatYearRange(edu.startDate, edu.endDate, edu.current)}
                      </span>
                    </div>
                    <div style={{ fontSize: "8pt", color: THEME.muted }}>
                      {edu.school}, {edu.location}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section style={{ marginBottom: "5px" }}>
              <SectionTitle>Projets</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {projects.map((project) => (
                  <div key={project.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                        {project.title}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "8pt", color: THEME.text, textAlign: "justify" }}>
                      {project.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", marginTop: "0.5px" }}>
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: "7pt",
                            color: THEME.primary,
                            backgroundColor: "#eef3fa",
                            padding: "0.5px 3px",
                            borderRadius: "2px",
                          }}
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

          {/* Certifications */}
          {certifications.length > 0 && (
            <section style={{ marginBottom: "5px" }}>
              <SectionTitle>Certifications</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                      {cert.degree}
                    </div>
                    <div style={{ fontSize: "8pt", color: THEME.muted }}>
                      {cert.school}, {cert.location} — {formatDateRange(cert.startDate, cert.endDate, cert.current)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "8.5pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: THEME.primary,
        borderBottom: `1px solid ${THEME.border}`,
        paddingBottom: "1px",
        marginBottom: "2px",
        marginTop: 0,
      }}
    >
      {children}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length <= 1) {
    return <p style={{ margin: 0, fontSize: "8pt", color: THEME.text, textAlign: "justify" }}>{items[0] || ""}</p>;
  }
  return (
    <ul style={{ margin: "0.5px 0 0 0", paddingLeft: "10px", fontSize: "8pt", color: THEME.text }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: "0.5px", textAlign: "justify" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}
