const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function parseLocale() {
  const arg = process.argv.find((a) => a.startsWith("--locale="));
  const locale = arg ? arg.split("=")[1] : "fr";
  if (locale !== "fr" && locale !== "en") {
    console.error(`❌ Locale non supportée: ${locale}. Utilisez "fr" ou "en".`);
    process.exit(1);
  }
  return locale;
}

const LOCALE = parseLocale();
const templatePath = path.resolve(__dirname, `cv-template-${LOCALE}.html`);
const outputPath = path.resolve(__dirname, `../public/cv/cv-print-${LOCALE}.html`);

const DEFAULT_SECTION_ORDER = [
  "header",
  "profile",
  "experience",
  "experienceAdditional",
  "skills",
  "languages",
  "education",
  "projects",
  "certifications",
];

function getDefaultSectionLabels(locale) {
  if (locale === "en") {
    return {
      header: "",
      profile: "Profile",
      experience: "Professional Experience",
      experienceAdditional: "Additional Experience",
      skills: "Skills",
      languages: "Languages",
      education: "Education",
      projects: "Projects",
      certifications: "Certifications",
    };
  }
  return {
    header: "",
    profile: "Profil",
    experience: "Expériences professionnelles",
    experienceAdditional: "Expériences complémentaires",
    skills: "Compétences",
    languages: "Langues",
    education: "Formation",
    projects: "Projets",
    certifications: "Certifications",
  };
}

const DEFAULT_SECTION_LABELS = getDefaultSectionLabels(LOCALE);

function getSkillCategoryLabels(locale) {
  if (locale === "en") {
    return {
      électrique: "Technical",
      normes: "Standards",
      web: "Web Development",
      logiciel: "Software",
      soft: "Soft Skills",
    };
  }
  return {
    électrique: "Techniques",
    normes: "Normes",
    web: "Développement web",
    logiciel: "Logiciels",
    soft: "Soft skills",
  };
}

const SKILL_CATEGORY_LABELS = getSkillCategoryLabels(LOCALE);

function getLanguageLevelLabels(locale) {
  if (locale === "en") {
    return { native: "Native", fluent: "Fluent", professional: "Professional", intermediate: "Intermediate", beginner: "Beginner" };
  }
  return { native: "Natif", fluent: "Courant", professional: "Professionnel", intermediate: "Intermédiaire", beginner: "Débutant" };
}

const LANGUAGE_LEVEL_LABELS = getLanguageLevelLabels(LOCALE);

function escapeHtml(text) {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function replaceConditional(template, key, value) {
  const escaped = escapeHtml(value);
  const regex = new RegExp(`\\{\\{#if ${key}\\}\\}(.*?)\\{\\{/if\\}\\}`, "gs");
  return template.replace(regex, escaped ? `$1` : "");
}

const MONTH_LABELS_FR = ["jan", "fév", "mars", "avr", "mai", "juin", "juill", "août", "sept", "oct", "nov", "déc"];
const MONTH_LABELS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthLabels(locale) {
  return locale === "en" ? MONTH_LABELS_EN : MONTH_LABELS_FR;
}

function formatDate(date, locale = LOCALE) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const month = getMonthLabels(locale)[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} ${year}`;
}

function presentLabel(locale = LOCALE) {
  return locale === "en" ? "Present" : "Présent";
}

function formatDateRange(start, end, current, locale = LOCALE) {
  const s = formatDate(start, locale);
  const e = current ? presentLabel(locale) : formatDate(end, locale);
  return `${s}${e ? ` — ${e}` : ""}`;
}

function formatYearRange(start, end, current, locale = LOCALE) {
  if (!start) return "";
  const s = (typeof start === "string" ? new Date(start) : start).getUTCFullYear();
  const e = current ? presentLabel(locale) : end ? (typeof end === "string" ? new Date(end) : end).getUTCFullYear() : "";
  return `${s}${e ? ` — ${e}` : ""}`;
}

function formatExperienceRange(start, end, current, locale = LOCALE) {
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

function languageLevel(level, locale = LOCALE) {
  const labels = getLanguageLevelLabels(locale);
  if (level >= 100) return labels.native;
  if (level >= 90) return labels.fluent;
  if (level >= 75) return labels.professional;
  if (level >= 60) return labels.intermediate;
  return labels.beginner;
}

function toBullets(text) {
  if (!text) return [];
  return text
    .split(/\. (?=[A-ZÀ-ÖØ-öø-ÿ0-9•])/) // keep French uppercase range for FR inputs
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : `${s}.`));
}

function getDefaultConfig(experiences, education, skills, projects, certifications) {
  const mainExperiences = experiences.filter((e) => e.category === "tech");
  const additionalExperiences = experiences.filter((e) => e.category !== "tech");
  return {
    sections: DEFAULT_SECTION_ORDER.map((key) => {
      const section = { key, visible: true, label: DEFAULT_SECTION_LABELS[key] };
      if (key === "experience") section.itemIds = mainExperiences.map((e) => e.id);
      if (key === "experienceAdditional") section.itemIds = additionalExperiences.map((e) => e.id);
      if (key === "education") section.itemIds = education.map((e) => e.id);
      if (key === "skills") section.itemIds = skills.filter((s) => s.category !== "langue").map((s) => s.id);
      if (key === "languages") section.itemIds = skills.filter((s) => s.category === "langue").map((s) => s.id);
      if (key === "projects") section.itemIds = projects.map((p) => p.id);
      if (key === "certifications") section.itemIds = certifications.map((c) => c.id);
      return section;
    }),
    itemOverrides: {},
  };
}

function mergeConfig(config, experiences, education, skills, projects, certifications) {
  const defaults = getDefaultConfig(experiences, education, skills, projects, certifications);
  if (!config) return defaults;

  const sectionMap = new Map(config.sections?.map((s) => [s.key, s]) || []);
  const mergedSections = DEFAULT_SECTION_ORDER.map((key) => {
    const saved = sectionMap.get(key);
    const def = defaults.sections.find((s) => s.key === key);
    return {
      ...def,
      ...saved,
      // Use locale-specific default labels for English; preserve custom labels for French.
      label: LOCALE === "en" ? def.label : saved?.label ?? def.label,
      itemIds: saved?.itemIds ?? def.itemIds,
    };
  });

  return {
    sections: mergedSections,
    itemOverrides: config.itemOverrides || {},
  };
}

function getSection(sections, key) {
  return sections.find((s) => s.key === key) || { key, visible: true, label: getDefaultSectionLabels(LOCALE)[key], itemIds: [] };
}

function orderItems(items, itemIds) {
  if (!itemIds || itemIds.length === 0) return items;
  const map = new Map(items.map((i) => [i.id, i]));
  return itemIds.map((id) => map.get(id)).filter(Boolean);
}

function getOverride(overrides, type, id) {
  return overrides[`${type}:${id}`] || {};
}

function renderSectionTitle(label) {
  return `<h2>${escapeHtml(label)}<span class="line"></span></h2>`;
}

function renderProfileSection(section, profile) {
  if (!section.visible) return "";
  const bio =
    LOCALE === "en"
      ? profile.cvPrintBioEn || profile.cvPrintBio || profile.bioEn || profile.bio || ""
      : profile.cvPrintBio || profile.bio || "";
  if (!bio) return "";
  return `<section>\n${renderSectionTitle(section.label)}\n<p class="profile">${escapeHtml(bio)}</p>\n</section>`;
}

function renderExperienceItems(items, section) {
  const itemOverrides = section.itemOverrides || {};
  return items
    .map((exp) => {
      const over = getOverride(itemOverrides, "experience", exp.id);

      const title =
        LOCALE === "en"
          ? over.titleEn || over.title || exp.titleEn || exp.title
          : over.title || exp.title;

      const subtitle =
        (LOCALE === "en" ? over.subtitleEn || over.subtitle : over.subtitle) || `${exp.company} — ${exp.location}`;

      const desc =
        LOCALE === "en"
          ? over.descriptionEn || over.description || exp.descriptionEn || exp.description
          : over.description || exp.description;

      const dateRange =
        (LOCALE === "en" ? over.dateRangeEn || over.dateRange : over.dateRange) ||
        formatExperienceRange(exp.startDate, exp.endDate, exp.current);

      const bullets = toBullets(desc);
      const descHtml =
        bullets.length <= 1
          ? `<div class="item-desc">${escapeHtml(bullets[0] || "")}</div>`
          : `<div class="item-desc"><ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul></div>`;

      return `<div class="item">\n<div class="item-header"><span class="item-title">${escapeHtml(title)}</span><span class="item-date">${escapeHtml(dateRange)}</span></div>\n<div class="item-sub">${escapeHtml(subtitle)}</div>\n${descHtml}\n</div>`;
    })
    .join("\n");
}

function renderExperienceSection(section, experiences) {
  if (!section.visible) return "";
  const mainExperiences = experiences.filter((e) => e.category === "tech");
  const items = orderItems(mainExperiences, section.itemIds);
  if (items.length === 0) return "";
  const itemsHtml = renderExperienceItems(items, section);
  return `<section>\n${renderSectionTitle(section.label)}\n${itemsHtml}\n</section>`;
}

function renderAdditionalExperienceSection(section, experiences) {
  if (!section.visible) return "";
  const additionalExperiences = experiences.filter((e) => e.category !== "tech");
  const items = orderItems(additionalExperiences, section.itemIds);
  if (items.length === 0) return "";
  const itemsHtml = renderExperienceItems(items, section);
  return `<section>\n${renderSectionTitle(section.label)}\n${itemsHtml}\n</section>`;
}

function renderSkillsSection(section, skills) {
  if (!section.visible) return "";
  const visibleSkills = orderItems(
    skills.filter((s) => s.category !== "langue"),
    section.itemIds
  );
  if (visibleSkills.length === 0) return "";
  const groups = visibleSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
  const categories = ["électrique", "normes", "web", "logiciel", "soft"].filter((cat) => groups[cat]?.length);
  if (categories.length === 0) return "";
  const groupsHtml = categories
    .map((cat) => {
      const rows = groups[cat]
        .map((s) => {
          const over = getOverride(section.itemOverrides || {}, "skill", s.id);
          const name =
            LOCALE === "en"
              ? over.titleEn || over.title || s.nameEn || s.name
              : over.title || s.name;
          const level = Math.max(0, Math.min(100, s.level || 0));
          return `<div class="skill-row"><span class="skill-name">${escapeHtml(name)}</span><div class="skill-bar"><div class="skill-fill" style="width:${level}%"></div></div></div>`;
        })
        .join("\n");
      return `<div class="skill-group"><h3>${escapeHtml(SKILL_CATEGORY_LABELS[cat] || cat)}</h3>${rows}</div>`;
    })
    .join("\n");
  return `<section>\n${renderSectionTitle(section.label)}\n${groupsHtml}\n</section>`;
}

function renderLanguagesSection(section, skills) {
  if (!section.visible) return "";
  const languages = orderItems(
    skills.filter((s) => s.category === "langue"),
    section.itemIds
  );
  if (languages.length === 0) return "";
  const itemsHtml = languages
    .map((lang) => {
      const over = getOverride(section.itemOverrides || {}, "skill", lang.id);
      const name =
        LOCALE === "en"
          ? over.titleEn || over.title || lang.nameEn || lang.name
          : over.title || lang.name;
      return `<div class="lang"><span>${escapeHtml(name)}</span><span>${lang.level}% — ${languageLevel(lang.level)}</span></div>`;
    })
    .join("\n");
  return `<section>\n${renderSectionTitle(section.label)}\n${itemsHtml}\n</section>`;
}

function renderEducationSection(section, education) {
  if (!section.visible) return "";
  const items = orderItems(education, section.itemIds);
  if (items.length === 0) return "";
  const itemsHtml = items
    .map((edu) => {
      const over = getOverride(section.itemOverrides || {}, "education", edu.id);
      const title =
        LOCALE === "en"
          ? over.titleEn || over.title || edu.degreeEn || edu.degree
          : over.title || edu.degree;
      const subtitle =
        (LOCALE === "en" ? over.subtitleEn || over.subtitle : over.subtitle) || `${edu.school}, ${edu.location}`;
      const dateRange =
        (LOCALE === "en" ? over.dateRangeEn || over.dateRange : over.dateRange) ||
        formatYearRange(edu.startDate, edu.endDate, edu.current);
      return `<div class="item">\n<div class="item-header"><span class="item-title">${escapeHtml(title)}</span><span class="item-date">${escapeHtml(dateRange)}</span></div>\n<div style="font-size: 8pt; color: #4b5563;">${escapeHtml(subtitle)}</div>\n</div>`;
    })
    .join("\n");
  return `<section>\n${renderSectionTitle(section.label)}\n${itemsHtml}\n</section>`;
}

function renderProjectsSection(section, projects) {
  if (!section.visible) return "";
  const items = orderItems(projects, section.itemIds);
  if (items.length === 0) return "";
  const itemsHtml = items
    .map((project) => {
      const over = getOverride(section.itemOverrides || {}, "project", project.id);
      const title =
        LOCALE === "en"
          ? over.titleEn || over.title || project.titleEn || project.title
          : over.title || project.title;
      const desc =
        LOCALE === "en"
          ? over.descriptionEn || over.description || project.descriptionEn || project.description
          : over.description || project.description;
      const techs =
        (LOCALE === "en" ? over.technologiesEn || over.technologies : over.technologies) || project.technologies || [];
      const techsHtml = techs.map((t) => `<span class="tech">${escapeHtml(t)}</span>`).join("");
      return `<div class="item">\n<div class="item-header"><span class="item-title">${escapeHtml(title)}</span></div>\n<div class="item-desc">${escapeHtml(desc)} ${techsHtml}</div>\n</div>`;
    })
    .join("\n");
  return `<section>\n${renderSectionTitle(section.label)}\n${itemsHtml}\n</section>`;
}

function renderCertificationsSection(section, certifications) {
  if (!section.visible) return "";
  const items = orderItems(certifications, section.itemIds);
  if (items.length === 0) return "";
  const itemsHtml = items
    .map((cert) => {
      const over = getOverride(section.itemOverrides || {}, "certification", cert.id);
      const title =
        LOCALE === "en"
          ? over.titleEn || over.title || cert.degreeEn || cert.degree
          : over.title || cert.degree;
      const subtitle =
        (LOCALE === "en" ? over.subtitleEn || over.subtitle : over.subtitle) || `${cert.school}, ${cert.location}`;
      const dateRange =
        (LOCALE === "en" ? over.dateRangeEn || over.dateRange : over.dateRange) ||
        formatDateRange(cert.startDate, cert.endDate, cert.current);
      return `<div class="item-desc"><strong>${escapeHtml(title)}</strong> — ${escapeHtml(subtitle)} — ${escapeHtml(dateRange)}</div>`;
    })
    .join("\n");
  return `<section>\n${renderSectionTitle(section.label)}\n${itemsHtml}\n</section>`;
}

async function main() {
  const [profile, experiences, education, skills, projects] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!profile) {
    console.error(LOCALE === "en" ? "❌ No profile found." : "❌ Aucun profil trouvé.");
    process.exit(1);
  }

  const degrees = education.filter((e) => e.type !== "CERTIFICATE");
  const certifications = education.filter((e) => e.type === "CERTIFICATE");

  const config = mergeConfig(profile.cvPrintConfig, experiences, degrees, skills, projects, certifications);
  const sections = config.sections;
  const itemOverrides = config.itemOverrides;

  // Attach overrides to each section for render helpers
  sections.forEach((s) => {
    s.itemOverrides = itemOverrides;
  });

  const fullName = profile.cvPrintFullName || profile.fullName;
  const title =
    LOCALE === "en"
      ? profile.cvPrintTitleEn || profile.cvPrintTitle || profile.titleEn || profile.title
      : profile.cvPrintTitle || profile.title;
  const email = profile.cvPrintEmail || profile.email;
  const phone = profile.cvPrintPhone || profile.phone;
  const location = profile.cvPrintLocation || profile.location;
  const linkedinRaw = profile.cvPrintLinkedin || profile.linkedin || "";
  const linkedin = linkedinRaw.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const website = profile.cvPrintWebsite || "abdenour-hellas.online";
  const generatedDate = new Date().toLocaleDateString(LOCALE === "en" ? "en-CA" : "fr-CA", { timeZone: "UTC" });

  let template = fs.readFileSync(templatePath, "utf-8");

  template = replaceConditional(template, "email", email);
  template = replaceConditional(template, "phone", phone);
  template = replaceConditional(template, "location", location);
  template = replaceConditional(template, "linkedin", linkedin);
  template = replaceConditional(template, "website", website);

  template = template
    .replace(/\{\{fullName\}\}/g, escapeHtml(fullName))
    .replace(/\{\{title\}\}/g, escapeHtml(title))
    .replace(/\{\{email\}\}/g, escapeHtml(email))
    .replace(/\{\{phone\}\}/g, escapeHtml(phone))
    .replace(/\{\{location\}\}/g, escapeHtml(location))
    .replace(/\{\{linkedin\}\}/g, escapeHtml(linkedin))
    .replace(/\{\{website\}\}/g, escapeHtml(website))
    .replace(/\{\{generatedDate\}\}/g, escapeHtml(generatedDate));

  template = template.replace(/\{\{section:profile\}\}/, renderProfileSection(getSection(sections, "profile"), profile));
  template = template.replace(/\{\{section:experience\}\}/, renderExperienceSection(getSection(sections, "experience"), experiences));
  template = template.replace(/\{\{section:experienceAdditional\}\}/, renderAdditionalExperienceSection(getSection(sections, "experienceAdditional"), experiences));
  template = template.replace(/\{\{section:skills\}\}/, renderSkillsSection(getSection(sections, "skills"), skills));
  template = template.replace(/\{\{section:languages\}\}/, renderLanguagesSection(getSection(sections, "languages"), skills));
  template = template.replace(/\{\{section:education\}\}/, renderEducationSection(getSection(sections, "education"), degrees));
  template = template.replace(/\{\{section:projects\}\}/, renderProjectsSection(getSection(sections, "projects"), projects));
  template = template.replace(/\{\{section:certifications\}\}/, renderCertificationsSection(getSection(sections, "certifications"), certifications));

  fs.writeFileSync(outputPath, template, "utf-8");
  console.log(LOCALE === "en" ? `✅ HTML CV updated: ${outputPath}` : `✅ HTML CV mis à jour : ${outputPath}`);
}

main()
  .catch((error) => {
    console.error(LOCALE === "en" ? "❌ Error generating HTML CV:" : "❌ Erreur lors de la génération du HTML CV :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
