const { execSync } = require("child_process");
const path = require("path");

const edgePaths = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];

const edge = edgePaths.find((p) => {
  try {
    execSync(`if exist "${p}" exit 0`);
    return true;
  } catch {
    return false;
  }
});

if (!edge) {
  console.error("❌ Microsoft Edge ou Google Chrome non trouvé.");
  console.error("Installez l'un de ces navigateurs ou modifiez le script avec le chemin correct.");
  process.exit(1);
}

const htmlPath = path.resolve(__dirname, "../public/cv/cv-print.html");
const pdfPath = path.resolve(__dirname, "../public/cv/Abdenour_Hellas_CV.pdf");

const cmd = `"${edge}" --headless --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=20000 --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\/g, "/")}"`;

console.log("🖨️  Génération du CV PDF...");
console.log(`📄 Source : ${htmlPath}`);
console.log(`💾 PDF : ${pdfPath}`);

try {
  execSync(cmd, { stdio: "inherit" });
  console.log("\n✅ CV PDF généré avec succès !");
} catch (error) {
  console.error("\n❌ Erreur lors de la génération du PDF.", error);
  process.exit(1);
}
