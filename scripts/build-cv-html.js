const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const templatePath = path.resolve(__dirname, "cv-template.html");
const outputPath = path.resolve(__dirname, "../public/cv/cv-print.html");

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

async function main() {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    console.error("❌ Aucun profil trouvé.");
    process.exit(1);
  }

  const fullName = profile.cvPrintFullName || profile.fullName || "";
  const title = profile.cvPrintTitle || profile.title || "";
  const email = profile.cvPrintEmail || profile.email || "";
  const phone = profile.cvPrintPhone || profile.phone || "";
  const location = profile.cvPrintLocation || profile.location || "";
  const linkedinRaw = profile.cvPrintLinkedin || profile.linkedin || "";
  const linkedin = linkedinRaw.replace(/^https?:\/\/(www\.)?/, "");
  const website = profile.cvPrintWebsite || "abdenour-hellas.online";
  const bio = profile.cvPrintBio || profile.bio || "";
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
    .replace(/\{\{bio\}\}/g, escapeHtml(bio))
    .replace(/\{\{generatedDate\}\}/g, escapeHtml(generatedDate));

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
