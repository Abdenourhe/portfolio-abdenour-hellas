"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Loader2,
  FileText,
  ExternalLink,
  Monitor,
  Printer,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  ImageIcon,
} from "lucide-react";
import CVPrintTemplate from "@/components/public/CVPrintTemplate";

async function getHtml2Pdf() {
  const mod = await import("html2pdf.js");
  return mod.default || mod;
}

type ViewMode = "screen" | "print";

const SECTIONS = [
  { href: "/admin/profile", label: "Profil & photo", icon: User },
  { href: "/admin/experiences", label: "Expériences", icon: Briefcase },
  { href: "/admin/education", label: "Formations", icon: GraduationCap },
  { href: "/admin/skills", label: "Compétences", icon: Wrench },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
];

export default function AdminCVPrintPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<ViewMode>("print");
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGeneratePDF = async () => {
    if (!cvRef.current) return;
    setGenerating(true);

    const html2pdf = await getHtml2Pdf();
    const element = cvRef.current;
    const opt = {
      margin: 0,
      filename: "Abdenour_Hellas_CV.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Générateur de CV</h1>
        <p className="text-muted-foreground">Impossible de charger les données.</p>
      </div>
    );
  }

  const hasPhoto = !!data.profile?.photoUrl;
  const skillCategories = Array.from(new Set((data.skills || []).map((s: any) => s.category).filter(Boolean)));
  const hasCategories = ["technique", "logiciel", "web", "soft", "langue"].every((cat) =>
    skillCategories.includes(cat)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FileText size={26} />
            Générateur de CV
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Prévisualisez, ajustez et exportez votre CV. Les modifications se font via les sections du dashboard, une seule photo est utilisée pour l’écran et le PDF.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <ImageIcon size={16} />
            Modifier la photo
          </a>
          <button
            onClick={handleGeneratePDF}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {generating ? "Génération..." : "Télécharger le PDF"}
          </button>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-3">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            hasPhoto
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
              : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900"
          }`}
        >
          {hasPhoto ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {hasPhoto ? "Photo de profil présente" : "Aucune photo de profil"}
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            hasCategories
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
              : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900"
          }`}
        >
          {hasCategories ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {hasCategories ? "Catégories de compétences OK" : "Catégories de compétences incomplètes"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Preview */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="inline-flex bg-muted rounded-lg p-1 border border-border">
            <button
              onClick={() => setMode("screen")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "screen"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor size={16} />
              Aperçu écran
            </button>
            <button
              onClick={() => setMode("print")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "print"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Printer size={16} />
              Aperçu print / PDF
            </button>
          </div>

          {/* Canvas */}
          <div
            className={`overflow-auto bg-gray-100 dark:bg-muted rounded-xl border border-border flex justify-center min-h-[600px] ${
              mode === "screen" ? "p-6" : "p-4"
            }`}
          >
            <div
              ref={cvRef}
              className={`shadow-lg ${mode === "screen" ? "scale-[0.92] origin-top" : ""}`}
              style={mode === "screen" ? { transform: "scale(0.92)", transformOrigin: "top center" } : {}}
            >
              <CVPrintTemplate
                profile={data.profile}
                experiences={data.experiences || []}
                education={data.education || []}
                skills={data.skills || []}
                projects={data.projects || []}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold text-primary mb-3">Modifier le contenu</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Le CV écran et le CV print partagent les mêmes données. Modifiez une section ci-dessous pour mettre à jour les deux.
            </p>
            <div className="space-y-2">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <a
                    key={section.href}
                    href={section.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors group"
                  >
                    <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="flex-1">{section.label}</span>
                    <ExternalLink size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold text-primary mb-3">Conseils pour un CV optimal</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Utilisez une photo professionnelle sur fond neutre.</li>
              <li>Gardez le profil sous 5 lignes et orienté vers le poste visé.</li>
              <li>Privilégiez les chiffres dans les expériences (ex. : « supervision de X techniciens »).</li>
              <li>Classez les compétences dans les catégories : <strong>technique, logiciel, web, soft, langue</strong>.</li>
              <li>Limitez le CV à 2 pages maximum.</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4">
            <h2 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">À propos des deux aperçus</h2>
            <p className="text-sm text-blue-700 dark:text-blue-500">
              <strong>Écran</strong> : zoom confortable pour relire le contenu.<br />
              <strong>Print / PDF</strong> : taille réelle A4, c’est ce qui sera imprimé ou téléchargé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
