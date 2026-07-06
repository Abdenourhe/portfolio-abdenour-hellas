"use client";

import { Profile, Experience, Education, Skill, Project, CvPrintConfig, CvPrintSectionConfig, CvPrintItemOverride } from "@/types";

interface CVPrintTemplateProps {
  profile: Profile | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications?: Education[];
  config?: CvPrintConfig | null;
  locale?: "fr" | "en";
}

const DEFAULT_SECTION_ORDER: CvPrintSectionConfig["key"][] = [
  "header",
  "profile",
  "experience",
  "skills",
  "languages",
  "education",
  "projects",
  "certifications",
];

const DEFAULT_SECTION_LABELS_FR: Record<CvPrintSectionConfig["key"], string> = {
  header: "",
  profile: "Profil",
  experience: "Expériences professionnelles",
  skills: "Compétences",
  languages: "Langues",
  education: "Formation",
  projects: "Projets",
  certifications: "Certifications",
};

const DEFAULT_SECTION_LABELS_EN: Record<CvPrintSectionConfig["key"], string> = {
  header: "",
  profile: "Profile",
  experience: "Professional Experience",
  skills: "Skills",
  languages: "Languages",
  education: "Education",
  projects: "Projects",
  certifications: "Certifications",
};

const ADDITIONAL_EXPERIENCE_LABEL = {
  fr: "Expérience complémentaire",
  en: "Additional Experience",
};

const PRESENT_TEXT = { fr: "Présent", en: "Present" };

const MONTH_LABELS_FR = [
  "jan",
  "fév",
  "mars",
  "avr",
  "mai",
  "juin",
  "juill",
  "août",
  "sept",
  "oct",
  "nov",
  "déc",
];

const MONTH_LABELS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SKILL_CATEGORY_LABELS_FR: Record<string, string> = {
  électrique: "Techniques",
  normes: "Normes",
  web: "Développement web",
  logiciel: "Logiciels",
  soft: "Soft skills",
};

const SKILL_CATEGORY_LABELS_EN: Record<string, string> = {
  électrique: "Technical",
  normes: "Standards",
  web: "Web Development",
  logiciel: "Software",
  soft: "Soft Skills",
};

const LANGUAGE_LEVEL_FR = {
  native: "Natif",
  fluent: "Courant",
  professional: "Professionnel",
  intermediate: "Intermédiaire",
  beginner: "Débutant",
};

const LANGUAGE_LEVEL_EN = {
  native: "Native",
  fluent: "Fluent",
  professional: "Professional",
  intermediate: "Intermediate",
  beginner: "Beginner",
};

function getDefaultConfig(
  experiences: Experience[],
  education: Education[],
  skills: Skill[],
  projects: Project[],
  certifications: Education[],
  locale: "fr" | "en"
): CvPrintConfig {
  const labels = locale === "en" ? DEFAULT_SECTION_LABELS_EN : DEFAULT_SECTION_LABELS_FR;
  return {
    sections: DEFAULT_SECTION_ORDER.map((key) => {
      const base: CvPrintSectionConfig = { key, visible: true, label: labels[key] };
      if (key === "experience") base.itemIds = experiences.map((e) => e.id);
      if (key === "education") base.itemIds = education.map((e) => e.id);
      if (key === "skills") base.itemIds = skills.filter((s) => s.category !== "langue").map((s) => s.id);
      if (key === "languages") base.itemIds = skills.filter((s) => s.category === "langue").map((s) => s.id);
      if (key === "projects") base.itemIds = projects.map((p) => p.id);
      if (key === "certifications") base.itemIds = certifications.map((c) => c.id);
      return base;
    }),
    itemOverrides: {},
  };
}

function mergeConfig(
  config: CvPrintConfig | null | undefined,
  experiences: Experience[],
  education: Education[],
  skills: Skill[],
  projects: Project[],
  certifications: Education[],
  locale: "fr" | "en"
): CvPrintConfig {
  const defaults = getDefaultConfig(experiences, education, skills, projects, certifications, locale);
  if (!config) return defaults;

  const sectionMap = new Map(config.sections.map((s) => [s.key, s]));
  const mergedSections = DEFAULT_SECTION_ORDER.map((key) => {
    const saved = sectionMap.get(key);
    const def = defaults.sections.find((s) => s.key === key)!;
    return {
      ...def,
      ...saved,
      label: saved?.label ?? def.label,
      itemIds: saved?.itemIds ?? def.itemIds,
    };
  });

  return {
    sections: mergedSections,
    itemOverrides: config.itemOverrides || {},
  };
}

function resolveSectionLabel(
  label: string | null | undefined,
  locale: "fr" | "en",
  defaultLabel: string
): string {
  if (locale === "en") {
    if (label?.startsWith("EN:")) return label.slice(3);
    if (label) return label;
    return defaultLabel;
  }
  // French: ignore English-prefixed labels and fall back to default
  if (label?.startsWith("EN:")) return defaultLabel;
  return label || defaultLabel;
}

function findSection(sections: CvPrintSectionConfig[], key: CvPrintSectionConfig["key"], locale: "fr" | "en") {
  const labels = locale === "en" ? DEFAULT_SECTION_LABELS_EN : DEFAULT_SECTION_LABELS_FR;
  const section = sections.find((s) => s.key === key);
  const rawLabel = section?.label;
  return {
    key,
    visible: section?.visible ?? true,
    label: resolveSectionLabel(rawLabel, locale, labels[key]),
    itemIds: section?.itemIds ?? [],
  };
}

function orderItems<T extends { id: string }>(items: T[], itemIds: string[] | null | undefined): T[] {
  if (!itemIds || itemIds.length === 0) return items;
  const map = new Map(items.map((i) => [i.id, i]));
  return itemIds.map((id) => map.get(id)).filter(Boolean) as T[];
}

function getOverride(overrides: Record<string, CvPrintItemOverride>, type: string, id: string): CvPrintItemOverride {
  return overrides[`${type}:${id}`] || {};
}

function getOverrideValue<T extends string | string[]>(
  override: CvPrintItemOverride,
  field: "title" | "subtitle" | "description" | "dateRange" | "technologies",
  locale: "fr" | "en"
): T | null | undefined {
  if (locale === "en") {
    const enKey = `${field}En` as keyof CvPrintItemOverride;
    return (override[enKey] as T | undefined) || (override[field] as T | undefined);
  }
  return override[field] as T | undefined;
}

const THEME = {
  primary: "#1e3a5f",
  text: "#111827",
  muted: "#4b5563",
  border: "#d1d5db",
  bg: "#ffffff",
  accent: "#C9A962",
};

function toBullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\. (?=[A-ZÀ-ÖØ-öø-ÿ0-9•])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : s + "."));
}

function formatDate(date: string | Date | null | undefined, locale: "fr" | "en" = "fr"): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const labels = locale === "en" ? MONTH_LABELS_EN : MONTH_LABELS_FR;
  const month = labels[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} ${year}`;
}

function formatDateRange(
  start: string | Date,
  end?: string | Date | null,
  current?: boolean,
  locale: "fr" | "en" = "fr"
): string {
  const s = formatDate(start, locale);
  const e = current ? PRESENT_TEXT[locale] : formatDate(end, locale);
  return `${s} ${e ? `— ${e}` : ""}`;
}

function formatYearRange(
  start: string | Date,
  end?: string | Date | null,
  current?: boolean,
  locale: "fr" | "en" = "fr"
): string {
  if (!start) return "";
  const s = (typeof start === "string" ? new Date(start) : start).getUTCFullYear();
  const e = current ? PRESENT_TEXT[locale] : end ? (typeof end === "string" ? new Date(end) : end).getUTCFullYear() : "";
  return `${s}${e ? ` — ${e}` : ""}`;
}

function formatExperienceRange(
  start: string | Date,
  end?: string | Date | null,
  current?: boolean,
  locale: "fr" | "en" = "fr"
): string {
  if (!start) return "";
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = end ? (typeof end === "string" ? new Date(end) : end) : null;
  const durationYears = endDate
    ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    : current
    ? Infinity
    : 0;
  if (durationYears > 2.5 && !current) {
    return formatYearRange(start, end, current, locale);
  }
  return formatDateRange(start, end, current, locale);
}

function languageLevel(level: number, locale: "fr" | "en" = "fr"): string {
  const labels = locale === "en" ? LANGUAGE_LEVEL_EN : LANGUAGE_LEVEL_FR;
  if (level >= 100) return labels.native;
  if (level >= 90) return labels.fluent;
  if (level >= 75) return labels.professional;
  if (level >= 60) return labels.intermediate;
  return labels.beginner;
}

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
  config: rawConfig,
  locale = "fr",
}: CVPrintTemplateProps) {
  if (!profile) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: THEME.muted }}>
        {locale === "en" ? "No profile found." : "Aucun profil trouvé."}
      </div>
    );
  }

  const mergedConfig = mergeConfig(rawConfig, experiences, education, skills, projects, certifications, locale);
  const { sections, itemOverrides } = mergedConfig;

  const profileSection = findSection(sections, "profile", locale);
  const experienceSection = findSection(sections, "experience", locale);
  const skillsSection = findSection(sections, "skills", locale);
  const languagesSection = findSection(sections, "languages", locale);
  const educationSection = findSection(sections, "education", locale);
  const projectsSection = findSection(sections, "projects", locale);
  const certificationsSection = findSection(sections, "certifications", locale);

  const visibleExperiences = experienceSection.visible
    ? orderItems(experiences, experienceSection.itemIds)
    : [];
  const mainExperiences = visibleExperiences.filter((e) => e.category === "tech");
  const additionalExperiences = visibleExperiences.filter((e) => e.category !== "tech");

  const visibleEducation = educationSection.visible ? orderItems(education, educationSection.itemIds) : [];
  const visibleProjects = projectsSection.visible ? orderItems(projects, projectsSection.itemIds) : [];
  const visibleCertifications = certificationsSection.visible
    ? orderItems(certifications, certificationsSection.itemIds)
    : [];
  const visibleSkills = skillsSection.visible
    ? orderItems(
        skills.filter((s) => s.category !== "langue"),
        skillsSection.itemIds
      )
    : [];
  const visibleLanguages = languagesSection.visible
    ? orderItems(
        skills.filter((s) => s.category === "langue"),
        languagesSection.itemIds
      )
    : [];

  const skillGroups = visibleSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const skillCategories = ["électrique", "normes", "web", "logiciel", "soft"].filter(
    (cat) => skillGroups[cat]?.length
  );

  const skillCategoryLabels = locale === "en" ? SKILL_CATEGORY_LABELS_EN : SKILL_CATEGORY_LABELS_FR;

  const cvFullName = profile.cvPrintFullName || profile.fullName;
  const cvTitle =
    locale === "en"
      ? profile.cvPrintTitleEn || profile.titleEn || profile.cvPrintTitle || profile.title
      : profile.cvPrintTitle || profile.title;
  const cvEmail = profile.cvPrintEmail || profile.email;
  const cvPhone = profile.cvPrintPhone || profile.phone;
  const cvLocation = profile.cvPrintLocation || profile.location;
  const cvBio =
    locale === "en"
      ? profile.cvPrintBioEn || profile.bioEn || profile.cvPrintBio || profile.bio
      : profile.cvPrintBio || profile.bio;
  const cvLinkedin = (profile.cvPrintLinkedin || profile.linkedin)?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const cvWebsite = profile.cvPrintWebsite || "abdenour-hellas.online";

  const headerContacts = [
    { icon: <MailIcon />, text: cvEmail },
    { icon: <PhoneIcon />, text: cvPhone },
    { icon: <MapPinIcon />, text: cvLocation },
    { icon: <LinkedInIcon />, text: cvLinkedin },
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
        lineHeight: 1.2,
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
            fontSize: "17pt",
            fontWeight: 700,
            color: THEME.text,
            margin: 0,
            letterSpacing: "-0.2px",
          }}
        >
          {cvFullName}
        </h1>
        <p
          style={{
            fontSize: "9.5pt",
            fontWeight: 500,
            color: THEME.primary,
            margin: "1px 0 0 0",
          }}
        >
          {cvTitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "3px 12px",
            marginTop: "5px",
            fontSize: "8pt",
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
        <div className="header-line" style={{ height: "2px", backgroundColor: THEME.accent, marginTop: "5px" }} />
      </header>

      {/* Profile */}
      {profileSection.visible && (
        <section style={{ marginBottom: "8px" }}>
          <SectionTitle>{profileSection.label}</SectionTitle>
          <p style={{ textAlign: "justify", margin: 0, fontSize: "8pt", color: THEME.text }}>
            {cvBio}
          </p>
        </section>
      )}

      {/* Main Experiences */}
      {experienceSection.visible && mainExperiences.length > 0 && (
        <section style={{ marginBottom: "8px" }}>
          <SectionTitle>{experienceSection.label}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {mainExperiences.map((exp) => {
              const over = getOverride(itemOverrides, "experience", exp.id);
              const title =
                getOverrideValue<string>(over, "title", locale) ||
                (locale === "en" ? exp.titleEn : undefined) ||
                exp.title;
              const subtitle =
                getOverrideValue<string>(over, "subtitle", locale) || `${exp.company} — ${exp.location}`;
              const description =
                getOverrideValue<string>(over, "description", locale) ||
                (locale === "en" ? exp.descriptionEn : undefined) ||
                exp.description;
              const dateRange =
                getOverrideValue<string>(over, "dateRange", locale) ||
                formatExperienceRange(exp.startDate, exp.endDate, exp.current, locale);
              return (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                      {title}
                    </span>
                    <span
                      className="item-date"
                      style={{
                        fontSize: "8pt",
                        color: THEME.accent,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {dateRange}
                    </span>
                  </div>
                  <div style={{ fontSize: "8pt", fontWeight: 600, color: THEME.muted, marginBottom: "1px" }}>
                    {subtitle}
                  </div>
                  <BulletList items={toBullets(description)} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Additional Experiences */}
      {experienceSection.visible && additionalExperiences.length > 0 && (
        <section style={{ marginBottom: "8px" }}>
          <SectionTitle>{ADDITIONAL_EXPERIENCE_LABEL[locale]}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {additionalExperiences.map((exp) => {
              const over = getOverride(itemOverrides, "experience", exp.id);
              const title =
                getOverrideValue<string>(over, "title", locale) ||
                (locale === "en" ? exp.titleEn : undefined) ||
                exp.title;
              const subtitle =
                getOverrideValue<string>(over, "subtitle", locale) || `${exp.company} — ${exp.location}`;
              const description =
                getOverrideValue<string>(over, "description", locale) ||
                (locale === "en" ? exp.descriptionEn : undefined) ||
                exp.description;
              const dateRange =
                getOverrideValue<string>(over, "dateRange", locale) ||
                formatExperienceRange(exp.startDate, exp.endDate, exp.current, locale);
              return (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                      {title}
                    </span>
                    <span
                      className="item-date"
                      style={{
                        fontSize: "8pt",
                        color: THEME.accent,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {dateRange}
                    </span>
                  </div>
                  <div style={{ fontSize: "8pt", fontWeight: 600, color: THEME.muted, marginBottom: "1px" }}>
                    {subtitle}
                  </div>
                  <BulletList items={toBullets(description)} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Two columns */}
      <div style={{ display: "flex", gap: "10px", flex: 1 }}>
        {/* Left column */}
        <div style={{ width: "80mm", flexShrink: 0 }}>
          {/* Skills */}
          {skillsSection.visible && skillCategories.length > 0 && (
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>{skillsSection.label}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {skillCategories.map((cat) => (
                  <div key={cat}>
                    <div
                      style={{
                        fontSize: "8pt",
                        fontWeight: 700,
                        color: THEME.primary,
                        textTransform: "uppercase",
                        marginBottom: "2px",
                      }}
                    >
                      {skillCategoryLabels[cat] || cat}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      {skillGroups[cat].map((s) => {
                        const over = getOverride(itemOverrides, "skill", s.id);
                        const skillName =
                          locale === "en"
                            ? over.titleEn || over.title || s.nameEn || s.name
                            : over.title || s.name;
                        return (
                          <div key={s.id}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "8pt",
                                color: THEME.text,
                              }}
                            >
                              <span>{skillName}</span>
                              <span style={{ fontSize: "7.5pt", color: THEME.muted }}>{s.level}%</span>
                            </div>
                            <div
                              style={{
                                height: "3px",
                                backgroundColor: "#e5e7eb",
                                borderRadius: "2px",
                                marginTop: "1px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${s.level}%`,
                                  height: "100%",
                                  backgroundColor: THEME.primary,
                                  borderRadius: "2px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languagesSection.visible && visibleLanguages.length > 0 && (
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>{languagesSection.label}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {visibleLanguages.map((lang) => {
                  const over = getOverride(itemOverrides, "skill", lang.id);
                  const langName =
                    locale === "en"
                      ? over.titleEn || over.title || lang.nameEn || lang.name
                      : over.title || lang.name;
                  return (
                    <div
                      key={lang.id}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8pt", color: THEME.text }}
                    >
                      <span>{langName}</span>
                      <span className="item-date" style={{ fontSize: "8pt", color: THEME.accent, whiteSpace: "nowrap" }}>
                        {lang.level}% — {languageLevel(lang.level, locale)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1 }}>
          {/* Education */}
          {educationSection.visible && visibleEducation.length > 0 && (
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>{educationSection.label}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {visibleEducation.map((edu) => {
                  const over = getOverride(itemOverrides, "education", edu.id);
                  const title =
                    getOverrideValue<string>(over, "title", locale) ||
                    (locale === "en" ? edu.degreeEn : undefined) ||
                    edu.degree;
                  const subtitle =
                    getOverrideValue<string>(over, "subtitle", locale) || `${edu.school}, ${edu.location}`;
                  const dateRange =
                    getOverrideValue<string>(over, "dateRange", locale) ||
                    formatYearRange(edu.startDate, edu.endDate, edu.current, locale);
                  return (
                    <div key={edu.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                          {title}
                        </span>
                        <span className="item-date" style={{ fontSize: "8pt", color: THEME.accent, whiteSpace: "nowrap", flexShrink: 0 }}>
                          {dateRange}
                        </span>
                      </div>
                      <div style={{ fontSize: "8pt", color: THEME.muted }}>
                        {subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Projects */}
          {projectsSection.visible && visibleProjects.length > 0 && (
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>{projectsSection.label}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {visibleProjects.map((project) => {
                  const over = getOverride(itemOverrides, "project", project.id);
                  const title =
                    getOverrideValue<string>(over, "title", locale) ||
                    (locale === "en" ? project.titleEn : undefined) ||
                    project.title;
                  const description =
                    getOverrideValue<string>(over, "description", locale) ||
                    (locale === "en" ? project.descriptionEn : undefined) ||
                    project.description;
                  const technologies =
                    getOverrideValue<string[]>(over, "technologies", locale) || project.technologies;
                  return (
                    <div key={project.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                          {title}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "8pt", color: THEME.text, textAlign: "justify" }}>
                        {description}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "2px" }}>
                        {technologies.map((tech) => (
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
                  );
                })}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certificationsSection.visible && visibleCertifications.length > 0 && (
            <section style={{ marginBottom: "7px" }}>
              <SectionTitle>{certificationsSection.label}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {visibleCertifications.map((cert) => {
                  const over = getOverride(itemOverrides, "certification", cert.id);
                  const title =
                    getOverrideValue<string>(over, "title", locale) ||
                    (locale === "en" ? cert.degreeEn : undefined) ||
                    cert.degree;
                  const subtitle =
                    getOverrideValue<string>(over, "subtitle", locale) || `${cert.school}, ${cert.location}`;
                  const dateRange =
                    getOverrideValue<string>(over, "dateRange", locale) ||
                    formatDateRange(cert.startDate, cert.endDate, cert.current, locale);
                  return (
                    <div key={cert.id}>
                      <div style={{ fontWeight: 700, fontSize: "8.5pt", color: THEME.text }}>
                        {title}
                      </div>
                      <div style={{ fontSize: "8pt", color: THEME.muted }}>
                        {subtitle} — <span className="item-date" style={{ color: THEME.accent }}>{dateRange}</span>
                      </div>
                    </div>
                  );
                })}
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
        {cvFullName} — {locale === "en" ? "CV generated on" : "CV généré le"} {new Date().toLocaleDateString(locale === "en" ? "en-CA" : "fr-CA", { timeZone: "UTC" })}
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
        gap: "8px",
        fontSize: "8.5pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: THEME.primary,
        marginBottom: "5px",
        marginTop: 0,
        borderBottom: `1px solid ${THEME.border}`,
        paddingBottom: "2px",
      }}
    >
      <span style={{ flexShrink: 0 }}>{children}</span>
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
