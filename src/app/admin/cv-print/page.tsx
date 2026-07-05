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
  RefreshCw,
  History,
  Settings2,
  AlertTriangle,
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

interface CvStatus {
  status: "synchronized" | "desynchronized";
  htmlOutdated: boolean;
  pdfOutdated: boolean;
  templateMtime: string | null;
  htmlMtime: string | null;
  pdfMtime: string | null;
  cvLastSyncedAt: string | null;
  lastCvGeneratedAt: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  cvGenerationMode: "HEADLESS" | "HTML2PDF";
}

interface CvLog {
  id: string;
  generatedAt: string;
  method: "HEADLESS" | "HTML2PDF";
  fileSizeKb: number | null;
  success: boolean;
  error: string | null;
}

export default function AdminCVPrintPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ViewMode>("print");
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [status, setStatus] = useState<CvStatus | null>(null);
  const [logs, setLogs] = useState<CvLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const cvRef = useRef<HTMLDivElement>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/cv/status");
      if (res.ok) setStatus(await res.json());
    } catch (error) {
      console.error("Failed to fetch CV status:", error);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/cv/logs");
      if (res.ok) setLogs(await res.json());
    } catch (error) {
      console.error("Failed to fetch CV logs:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetchStatus();
    fetchLogs();
  }, []);

  const handleDownloadHtml2Pdf = async () => {
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
      setMessage("PDF téléchargé avec html2pdf.js");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      setMessage("Erreur lors de la génération du PDF.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateHeadless = async () => {
    setRegenerating(true);
    setMessage("");
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "HEADLESS" }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage(`PDF régénéré avec succès (${result.fileSizeKb} Ko)`);
        fetchStatus();
        fetchLogs();
      } else {
        setMessage("Erreur : " + (result.error || "Échec de la régénération"));
      }
    } catch (error) {
      setMessage("Erreur réseau lors de la régénération.");
    } finally {
      setRegenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleModeChange = async (newMode: "HEADLESS" | "HTML2PDF") => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvGenerationMode: newMode }),
      });
      if (res.ok) {
        setStatus((prev) => (prev ? { ...prev, cvGenerationMode: newMode } : null));
        setMessage(`Mode de génération par défaut : ${newMode === "HEADLESS" ? "Headless" : "html2pdf.js"}`);
      }
    } catch (error) {
      console.error("Failed to update generation mode:", error);
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
            onClick={handleDownloadHtml2Pdf}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {generating ? "Génération..." : "Télécharger le PDF"}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Printer size={16} />
            Imprimer
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
        {status && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              status.status === "synchronized"
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
            }`}
          >
            {status.status === "synchronized" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {status.status === "synchronized" ? "CV synchronisé" : "CV désynchronisé"}
          </div>
        )}
      </div>

      {message && (
        <p
          className={`text-sm ${message.includes("succès") || message.includes("téléchargé") || message.includes("régénéré") ? "text-secondary" : "text-destructive"}`}
        >
          {message}
        </p>
      )}

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
                certifications={data.certifications || []}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Synchronization status */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <AlertCircle size={16} />
              Statut de synchronisation
            </h2>
            {status ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">État</span>
                  <span
                    className={`font-medium ${
                      status.status === "synchronized" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status.status === "synchronized" ? "Synchronisé" : "Désynchronisé"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Template React</span>
                  <span>{status.templateMtime ? new Date(status.templateMtime).toLocaleString("fr-CA") : "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">cv-print.html</span>
                  <span>{status.htmlMtime ? new Date(status.htmlMtime).toLocaleString("fr-CA") : "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">PDF</span>
                  <span>{status.pdfMtime ? new Date(status.pdfMtime).toLocaleString("fr-CA") : "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dernière synchro</span>
                  <span>{status.cvLastSyncedAt ? new Date(status.cvLastSyncedAt).toLocaleString("fr-CA") : "—"}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chargement du statut...</p>
            )}
          </div>

          {/* Generation controls */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Settings2 size={16} />
              Génération PDF
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mode par défaut</label>
                <select
                  value={status?.cvGenerationMode || "HEADLESS"}
                  onChange={(e) => handleModeChange(e.target.value as "HEADLESS" | "HTML2PDF")}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
                >
                  <option value="HEADLESS">Headless (Edge/Chrome serveur)</option>
                  <option value="HTML2PDF">html2pdf.js (navigateur client)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Headless donne un PDF identique au template HTML statique. html2pdf.js fonctionne partout.
                </p>
              </div>

              <button
                onClick={handleRegenerateHeadless}
                disabled={regenerating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {regenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {regenerating ? "Génération..." : "Régénérer le PDF"}
              </button>

              {status?.cvUrl && (
                <a
                  href={status.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors"
                >
                  <Download size={16} />
                  Télécharger le PDF actuel
                </a>
              )}
            </div>
          </div>

          {/* Logs history */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <History size={16} />
              Historique
            </h2>
            {logsLoading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune génération enregistrée.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2 rounded-lg text-xs border ${
                      log.success
                        ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900"
                        : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{log.method === "HEADLESS" ? "Headless" : "html2pdf.js"}</span>
                      <span className={log.success ? "text-green-700" : "text-red-700"}>
                        {log.success ? "Succès" : "Échec"}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      {new Date(log.generatedAt).toLocaleString("fr-CA")}
                    </div>
                    {log.fileSizeKb ? (
                      <div className="text-muted-foreground">{log.fileSizeKb} Ko</div>
                    ) : null}
                    {log.error ? <div className="text-red-600 mt-1">{log.error}</div> : null}
                  </div>
                ))}
              </div>
            )}
          </div>

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
