const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const templatePath = path.resolve(__dirname, "cv-template.html");
const outputPath = path.resolve(__dirname, "../public/cv/cv-print.html");

const DEFAULT_SECTION_ORDER = [
  "header",
  "profile",
  "experience",
  "skills",
  "languages",
  "education",
  "projects",
  "certifications",
];

const DEFAULT_SECTION_LABELS = {
  header: "",
  profile: "Profil",
  experience: "Expériences professionnelles",
  skills: "Compétences",
  languages: "Langues",
  education: "Formation",
  projects: "Projets",
  certifications: "Certifications",
};

const SKILL_CATEGORY_LABELS = {
  électrique: "Techniques",
  normes: "Normes",
  web: "Développement web",
  logiciel: "Logiciels",
  soft: "Soft skills",
};

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

const MONTH_LABELS = [
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

function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const month = MONTH_LABELS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} ${year}`;
}

function formatDateRange(start, end, current) {
  const s = formatDate(start);
  const e = current ? "Présent" : formatDate(end);
  return `${s}${e ? ` — ${e}` : ""}`;
}

function formatYearRange(start, end, current) {
  if (!start) return "";
  const s = (typeof start === "string" ? new Date(start) : start).getUTCFullYear();
  const e = current ? "Présent" : end ? (typeof end === "string" ? new Date(end) : end).getUTCFullYear() : "";
  return `${s}${e ? ` — ${e}` : ""}`;
}

function formatExperienceRange(start, end, current) {
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

function languageLevel(level) {
  if (level >= 100) return "Natif";
  if (level >= 90) return "Courant";
  if (level >= 75) return "Professionnel";
  if (level >= 60) return "Intermédiaire";
  return "Débutant";
}

function toBullets(text) {
  if (!text) return [];
  return text
    .split(/\. (?=[A-ZÀ-ÖØ-öø-ÿ0-9•])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : `${s}.`));
}

function getDefaultConfig(experiences, education, skills, projects, certifications) {
  return {
    sections: DEFAULT_SECTION_ORDER.map((key) => {
      const section = { key, visible: true, label: DEFAULT_SECTION_LABELS[key] };
      if (key === "experience") section.itemIds = experiences.map((e) => e.id);
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
      label: saved?.label ?? def.label,
      itemIds: saved?.itemIds ?? def.itemIds,
    };
  });

  return {
    sections: mergedSections,
    itemOverrides: config.itemOverrides || {},
  };
}

function getSection(sections, key) {
  return sections.find((s) => s.key === key) || { key, visible: true, label: DEFAULT_SECTION_LABELS[key], itemIds: [] };
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
  const bio = profile.cvPrintBio || profile.bio || "";
  if (!bio) return "";
  return `<section>\n${renderSectionTitle(section.label)}\n<p class="profile">${escapeHtml(bio)}</p>\n</section>`;
}

function renderExperienceSection(section, experiences) {
  if (!section.visible) return "";
  const items = orderItems(experiences, section.itemIds);
  if (items.length === 0) return "";
  const itemsHtml = items
    .map((exp) => {
      const over = getOverride(section.itemOverrides || {}, "experience", exp.id);
      const title = over.title || exp.title;
      const dateRange = over.dateRange || formatExperienceRange(exp.startDate, exp.endDate, exp.current);
      const subtitle = over.subtitle || `${exp.company} — ${exp.location}`;
      const desc = over.description || exp.description;
      const bullets = toBullets(desc);
      const descHtml =
        bullets.length <= 1
          ? `<div class="item-desc">${escapeHtml(bullets[0] || "")}</div>`
          : `<div class="item-desc"><ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul></div>`;
      return `<div class="item">\n<div class="item-header"><span class="item-title">${escapeHtml(title)}</span><span class="item-date">${escapeHtml(dateRange)}</span></div>\n<div class="item-sub">${escapeHtml(subtitle)}</div>\n${descHtml}\n</div>`;
    })
    .join("\n");
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
      const names = groups[cat].map((s) => escapeHtml(getOverride({}, "skill", s.id).title || s.name)).join(", ");
      return `<div class="skill-group"><h3>${escapeHtml(SKILL_CATEGORY_LABELS[cat] || cat)}</h3><div class="skill-list">${names}</div></div>`;
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
      const name = over.title || lang.name;
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
      const title = over.title || edu.degree;
      const dateRange = over.dateRange || formatYearRange(edu.startDate, edu.endDate, edu.current);
      const subtitle = over.subtitle || `${edu.school}, ${edu.location}`;
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
      const title = over.title || project.title;
      const desc = over.description || project.description;
      const techs = over.technologies || project.technologies || [];
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
      const title = over.title || cert.degree;
      const subtitle = over.subtitle || `${cert.school}, ${cert.location}`;
      const dateRange = over.dateRange || formatDateRange(cert.startDate, cert.endDate, cert.current);
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
    console.error("❌ Aucun profil trouvé.");
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
  const title = profile.cvPrintTitle || profile.title;
  const email = profile.cvPrintEmail || profile.email;
  const phone = profile.cvPrintPhone || profile.phone;
  const location = profile.cvPrintLocation || profile.location;
  const linkedinRaw = profile.cvPrintLinkedin || profile.linkedin || "";
  const linkedin = linkedinRaw.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const website = profile.cvPrintWebsite || "abdenour-hellas.online";
  const generatedDate = new Date().toLocaleDateString("fr-CA", { timeZone: "UTC" });

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
  template = template.replace(/\{\{section:skills\}\}/, renderSkillsSection(getSection(sections, "skills"), skills));
  template = template.replace(/\{\{section:languages\}\}/, renderLanguagesSection(getSection(sections, "languages"), skills));
  template = template.replace(/\{\{section:education\}\}/, renderEducationSection(getSection(sections, "education"), degrees));
  template = template.replace(/\{\{section:projects\}\}/, renderProjectsSection(getSection(sections, "projects"), projects));
  template = template.replace(/\{\{section:certifications\}\}/, renderCertificationsSection(getSection(sections, "certifications"), certifications));

  fs.writeFileSync(outputPath, template, "utf-8");
  console.log(`✅ HTML CV mis à jour : ${outputPath}`);
}

main()
  .catch((error) => {
    console.error("❌ Erreur lors de la génération du HTML CV :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
