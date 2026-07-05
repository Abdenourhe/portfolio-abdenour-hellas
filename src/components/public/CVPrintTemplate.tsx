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

// Simple inline SVG icons
const ICON_SIZE = 10;
const MailIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke={THEME.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m2 7 8.97 5.7a1.94 1.94 0 0 0 2.06 0L22 7"/></svg>
);
const PhoneIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke={THEME.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const MapPinIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke={THEME.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const LinkedInIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke={THEME.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);
const GlobeIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke={THEME.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

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

  const cvFullName = profile.cvPrintFullName || profile.fullName;
  const cvTitle = profile.cvPrintTitle || profile.title;
  const cvEmail = profile.cvPrintEmail || profile.email;
  const cvPhone = profile.cvPrintPhone || profile.phone;
  const cvLocation = profile.cvPrintLocation || profile.location;
  const cvBio = profile.cvPrintBio || profile.bio;
  const cvLinkedin = profile.cvPrintLinkedin || profile.linkedin;
  const cvWebsite = profile.cvPrintWebsite || "abdenour-hellas.online";

  const headerContacts = [
    { icon: <MailIcon />, text: cvEmail },
    { icon: <PhoneIcon />, text: cvPhone },
    { icon: <MapPinIcon />, text: cvLocation },
    { icon: <LinkedInIcon />, text: cvLinkedin?.replace(/^https?:\/\/(www\.)?/, "") },
    { icon: <GlobeIcon />, text: cvWebsite },
  ].filter((c) => c.text);

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
        fontSize: "8pt",
        lineHeight: 1.15,
        color: THEME.text,
        backgroundColor: THEME.bg,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "7px" }}>
        <h1
          style={{
            fontSize: "18pt",
            fontWeight: 800,
            color: THEME.text,
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {cvFullName}
        </h1>
        <p
          style={{
            fontSize: "10pt",
            fontWeight: 600,
            color: THEME.primary,
            margin: "2px 0 0 0",
          }}
        >
          {cvTitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 16px",
            marginTop: "5px",
            fontSize: "8.5pt",
            color: THEME.muted,
          }}
        >
          {headerContacts.map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              {c.icon}
              {c.text}
            </span>
          ))}
        </div>
        <div style={{ height: "2px", backgroundColor: THEME.primary, marginTop: "5px" }} />
      </header>

      {/* Profile */}
      <section style={{ marginBottom: "8px" }}>
        <SectionTitle>Profil</SectionTitle>
        <p style={{ textAlign: "justify", margin: 0, fontSize: "8pt", color: THEME.text }}>
          {cvBio}
        </p>
      </section>

      {/* Experiences */}
      {experiences.length > 0 && (
        <section style={{ marginBottom: "8px" }}>
          <SectionTitle>Expériences professionnelles</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                    {exp.title}
                  </span>
                  <span
                    style={{
                      fontSize: "8pt",
                      color: THEME.muted,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatExperienceRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div style={{ fontSize: "8pt", fontWeight: 600, color: THEME.muted, marginBottom: "1px" }}>
                  {exp.company} — {exp.location}
                </div>
                <BulletList items={toBullets(exp.description)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two columns */}
      <div style={{ display: "flex", gap: "10px", flex: 1 }}>
        {/* Left column */}
        <div style={{ width: "80mm", flexShrink: 0 }}>
          {/* Skills */}
          {skillCategories.length > 0 && (
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>Compétences</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {skillCategories.map((cat) => (
                  <div key={cat}>
                    <div
                      style={{
                        fontSize: "8pt",
                        fontWeight: 700,
                        color: THEME.primary,
                        textTransform: "uppercase",
                        marginBottom: "1px",
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
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>Langues</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {languages.map((lang) => (
                  <div
                    key={lang.id}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8pt", color: THEME.text }}
                  >
                    <span>{lang.name}</span>
                    <span style={{ fontSize: "8pt", color: THEME.muted, whiteSpace: "nowrap" }}>
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
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>Formation</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                        {edu.degree}
                      </span>
                      <span style={{ fontSize: "8pt", color: THEME.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
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
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>Projets</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {projects.map((project) => (
                  <div key={project.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                        {project.title}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "8pt", color: THEME.text, textAlign: "justify" }}>
                      {project.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "2px" }}>
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: "7pt",
                            color: THEME.primary,
                            backgroundColor: "#eef3fa",
                            padding: "1px 3px",
                            borderRadius: "2px",
                            fontWeight: 500,
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
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>Certifications</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          paddingTop: "6px",
          borderTop: `1px solid ${THEME.border}`,
          fontSize: "7pt",
          color: THEME.muted,
          textAlign: "center",
        }}
      >
        {cvFullName} — CV généré le {new Date().toLocaleDateString("fr-CA", { timeZone: "UTC" })}
      </footer>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "9pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: THEME.primary,
        marginBottom: "4px",
        marginTop: 0,
      }}
    >
      <span style={{ flexShrink: 0 }}>{children}</span>
      <span style={{ flex: 1, height: "1px", backgroundColor: THEME.border, minWidth: "20px" }} />
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length <= 1) {
    return <p style={{ margin: 0, fontSize: "8.5pt", color: THEME.text, textAlign: "justify" }}>{items[0] || ""}</p>;
  }
  return (
    <ul style={{ margin: "1px 0 0 0", paddingLeft: "10px", fontSize: "8pt", color: THEME.text, listStyleType: "disc" }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: "1px", textAlign: "justify" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}
