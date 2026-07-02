"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, FileText, ExternalLink } from "lucide-react";
import CVPrintTemplate from "@/components/public/CVPrintTemplate";

async function getHtml2Pdf() {
  const mod = await import("html2pdf.js");
  return mod.default || mod;
}

export default function AdminCVPrintPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
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
        <h1 className="text-2xl font-bold text-primary mb-4">Générateur de CV PDF</h1>
        <p className="text-muted-foreground">Impossible de charger les données.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FileText size={24} />
            Générateur de CV PDF
          </h1>
          <p className="text-muted-foreground mt-1">
            Prévisualisez et générez le CV PDF à partir des données du dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <ExternalLink size={16} />
            Modifier le profil
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Preview */}
        <div className="overflow-auto bg-gray-100 p-4 rounded-xl border border-border flex justify-center min-h-[600px]">
          <div ref={cvRef} className="shadow-lg">
            <CVPrintTemplate
              profile={data.profile}
              experiences={data.experiences || []}
              education={data.education || []}
              skills={data.skills || []}
              projects={data.projects || []}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold text-primary mb-3">Comment ça marche</h2>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Les données viennent de votre profil, expériences, formations, compétences et projets.</li>
              <li>Modifiez ces données via les sections correspondantes du dashboard.</li>
              <li>Revenez sur cette page et cliquez sur "Télécharger le PDF".</li>
            </ol>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold text-primary mb-3">Sections à modifier</h2>
            <div className="space-y-2">
              <a href="/admin/profile" className="block text-sm text-primary hover:underline">→ Profil</a>
              <a href="/admin/experiences" className="block text-sm text-primary hover:underline">→ Expériences</a>
              <a href="/admin/education" className="block text-sm text-primary hover:underline">→ Formations</a>
              <a href="/admin/skills" className="block text-sm text-primary hover:underline">→ Compétences</a>
              <a href="/admin/projects" className="block text-sm text-primary hover:underline">→ Projets</a>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4">
            <h2 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Conseil</h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-500">
              Pour un rendu optimal, utilisez les catégories de compétences suivantes :{" "}
              <strong>technique</strong>, <strong>logiciel</strong>, <strong>web</strong>,{" "}
              <strong>soft</strong>, <strong>langue</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
