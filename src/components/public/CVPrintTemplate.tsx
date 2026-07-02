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
  return d.toLocaleDateString("fr-CA", { month: "short", year: "numeric" });
}

function formatDateRange(start: string | Date, end?: string | Date | null, current?: boolean): string {
  const s = formatDate(start);
  const e = current ? "Présent" : formatDate(end);
  return `${s} ${e ? `— ${e}` : ""}`;
}

function formatYearRange(start: string | Date, end?: string | Date | null, current?: boolean): string {
  if (!start) return "";
  const s = new Date(start).getFullYear();
  const e = current ? "Présent" : end ? new Date(end).getFullYear() : "";
  return `${s}${e ? ` — ${e}` : ""}`;
}

function languageLevel(level: number): string {
  if (level >= 100) return "Natif";
  if (level >= 90) return "Courant";
  if (level >= 75) return "Professionnel";
  if (level >= 60) return "Intermédiaire";
  return "Débutant";
}

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  électrique: "ÉLECTRIQUE & INDUSTRIEL",
  normes: "NORMES",
  web: "DÉVELOPPEMENT WEB",
  logiciel: "LOGICIELS",
  soft: "SOFT SKILLS",
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
        padding: "15mm",
        fontFamily: '"Inter", "Calibri", "Segoe UI", sans-serif',
        fontSize: "10pt",
        lineHeight: 1.25,
        color: THEME.text,
        backgroundColor: THEME.bg,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: `1.5px solid ${THEME.primary}`, paddingBottom: "10px", marginBottom: "10px" }}>
        <h1
          style={{
            fontSize: "22pt",
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
            fontSize: "11.5pt",
            fontWeight: 600,
            color: THEME.primary,
            margin: "3px 0 0 0",
            opacity: 0.9,
          }}
        >
          {profile.title}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "6px",
            fontSize: "9.5pt",
            color: THEME.muted,
          }}
        >
          <span>{profile.email}</span>
          <span>{profile.phone}</span>
          <span>{profile.location}</span>
          <span>{profile.linkedin?.replace(/^https?:\/\//, "")}</span>
          <span>abdenour-hellas.online</span>
        </div>
      </header>

      {/* Profile */}
      <section style={{ marginBottom: "10px" }}>
        <SectionTitle>Profil professionnel</SectionTitle>
        <p style={{ textAlign: "justify", margin: 0, fontSize: "10pt", color: THEME.text }}>
          {profile.bio}
        </p>
      </section>

      {/* Experiences */}
      {experiences.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <SectionTitle>Expériences professionnelles</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontWeight: 700, fontSize: "10.5pt", color: THEME.text }}>
                    {exp.title}
                  </span>
                  <span
                    style={{
                      fontSize: "9pt",
                      color: THEME.muted,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div style={{ fontSize: "9.5pt", fontWeight: 600, color: THEME.muted, marginBottom: "2px" }}>
                  {exp.company} — {exp.location}
                </div>
                <BulletList items={toBullets(exp.description)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <SectionTitle>Compétences</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {skillCategories.map((cat) => (
              <div key={cat} style={{ display: "flex", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "9pt",
                    fontWeight: 700,
                    color: THEME.primary,
                    minWidth: "150px",
                    flexShrink: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {SKILL_CATEGORY_LABELS[cat] || cat}
                </span>
                <span style={{ fontSize: "9.5pt", color: THEME.text }}>
                  {skillGroups[cat].map((s) => s.name).join(" | ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <SectionTitle>Langues</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: "10pt", color: THEME.text }}>
                <strong>{lang.name}</strong> — {languageLevel(lang.level)}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <SectionTitle>Formation</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "10pt", color: THEME.text }}>
                    {edu.degree}
                  </span>
                  <span style={{ fontSize: "9.5pt", color: THEME.muted, marginLeft: "6px" }}>
                    — {edu.school}, {edu.location}
                  </span>
                </div>
                <span style={{ fontSize: "9pt", color: THEME.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {formatYearRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <SectionTitle>Projets</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {projects.map((project) => (
              <div key={project.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontWeight: 700, fontSize: "10pt", color: THEME.text }}>
                    {project.title}
                  </span>
                </div>
                <p style={{ margin: "1px 0 2px 0", fontSize: "9.5pt", color: THEME.text }}>
                  {project.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: "8.5pt",
                        color: THEME.primary,
                        backgroundColor: "#eef3fa",
                        padding: "1px 5px",
                        borderRadius: "3px",
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
        <section style={{ marginBottom: "10px" }}>
          <SectionTitle>Certifications</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "10pt", color: THEME.text }}>
                    {cert.degree}
                  </span>
                  <span style={{ fontSize: "9.5pt", color: THEME.muted, marginLeft: "6px" }}>
                    — {cert.school}, {cert.location}
                  </span>
                </div>
                <span style={{ fontSize: "9pt", color: THEME.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {formatDateRange(cert.startDate, cert.endDate, cert.current)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          paddingTop: "8px",
          borderTop: `1px solid ${THEME.border}`,
          fontSize: "8pt",
          color: THEME.muted,
          textAlign: "center",
        }}
      >
        CV généré le {new Date().toLocaleDateString("fr-CA")} — {profile.fullName}
      </footer>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "10.5pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: THEME.primary,
        borderBottom: `1px solid ${THEME.border}`,
        paddingBottom: "2px",
        marginBottom: "5px",
        marginTop: 0,
      }}
    >
      {children}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length <= 1) {
    return <p style={{ margin: 0, fontSize: "9.5pt", color: THEME.text }}>{items[0] || ""}</p>;
  }
  return (
    <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", fontSize: "9.5pt", color: THEME.text }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: "1px" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}
