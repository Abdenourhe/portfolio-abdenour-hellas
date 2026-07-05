"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Loader2,
  FileText,
  Monitor,
  Printer,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  History,
  Settings2,
  ShieldCheck,
  AlertCircle,
  Save,
  Pencil,
  RotateCcw,
} from "lucide-react";
import CVPrintTemplate from "@/components/public/CVPrintTemplate";

interface CvPrintFormData {
  cvPrintFullName: string;
  cvPrintTitle: string;
  cvPrintEmail: string;
  cvPrintPhone: string;
  cvPrintLocation: string;
  cvPrintLinkedin: string;
  cvPrintWebsite: string;
  cvPrintBio: string;
}

async function getHtml2Pdf() {
  const mod = await import("html2pdf.js");
  return mod.default || mod;
}

type ViewMode = "screen" | "print";

interface CvStatus {
  status: "synchronized" | "desynchronized";
  reason: string | null;
  templateHash: string | null;
  htmlHash: string | null;
  hashesMatch: boolean;
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [cvForm, setCvForm] = useState<CvPrintFormData>({
    cvPrintFullName: "",
    cvPrintTitle: "",
    cvPrintEmail: "",
    cvPrintPhone: "",
    cvPrintLocation: "",
    cvPrintLinkedin: "",
    cvPrintWebsite: "",
    cvPrintBio: "",
  });
  const [formChanged, setFormChanged] = useState(false);
  const [saving, setSaving] = useState(false);
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
        const p = result.profile || {};
        setCvForm({
          cvPrintFullName: p.cvPrintFullName || "",
          cvPrintTitle: p.cvPrintTitle || "",
          cvPrintEmail: p.cvPrintEmail || "",
          cvPrintPhone: p.cvPrintPhone || "",
          cvPrintLocation: p.cvPrintLocation || "",
          cvPrintLinkedin: p.cvPrintLinkedin || "",
          cvPrintWebsite: p.cvPrintWebsite || "",
          cvPrintBio: p.cvPrintBio || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetchStatus();
    fetchLogs();
  }, []);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const updateFormField = (field: keyof CvPrintFormData, value: string) => {
    setCvForm((prev) => ({ ...prev, [field]: value }));
    setFormChanged(true);
  };

  const resetForm = () => {
    if (!data?.profile) return;
    const p = data.profile;
    setCvForm({
      cvPrintFullName: p.cvPrintFullName || "",
      cvPrintTitle: p.cvPrintTitle || "",
      cvPrintEmail: p.cvPrintEmail || "",
      cvPrintPhone: p.cvPrintPhone || "",
      cvPrintLocation: p.cvPrintLocation || "",
      cvPrintLinkedin: p.cvPrintLinkedin || "",
      cvPrintWebsite: p.cvPrintWebsite || "",
      cvPrintBio: p.cvPrintBio || "",
    });
    setFormChanged(false);
  };

  const handleSaveCvContent = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cvForm,
          // Convert empty strings to null so the template falls back to public profile fields
          cvPrintFullName: cvForm.cvPrintFullName.trim() || null,
          cvPrintTitle: cvForm.cvPrintTitle.trim() || null,
          cvPrintEmail: cvForm.cvPrintEmail.trim() || null,
          cvPrintPhone: cvForm.cvPrintPhone.trim() || null,
          cvPrintLocation: cvForm.cvPrintLocation.trim() || null,
          cvPrintLinkedin: cvForm.cvPrintLinkedin.trim() || null,
          cvPrintWebsite: cvForm.cvPrintWebsite.trim() || null,
          cvPrintBio: cvForm.cvPrintBio.trim() || null,
        }),
      });
      if (res.ok) {
        showMessage("Contenu du CV enregistré avec succès.", "success");
        setFormChanged(false);
        // Refresh data so the preview uses the new values
        const refreshed = await fetch("/api/homepage").then((r) => r.json());
        setData(refreshed);
      } else {
        const err = await res.json().catch(() => ({}));
        showMessage("Erreur : " + (err.error || "Échec de l'enregistrement"), "error");
      }
    } catch (error) {
      showMessage("Erreur réseau lors de l'enregistrement.", "error");
    } finally {
      setSaving(false);
    }
  };

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
      showMessage("PDF téléchargé avec succès (html2pdf.js)", "success");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      showMessage("Erreur lors du téléchargement du PDF.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateHeadless = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "HEADLESS" }),
      });
      const result = await res.json();
      if (res.ok) {
        showMessage(`PDF régénéré avec succès (${result.fileSizeKb} Ko)`, "success");
        fetchStatus();
        fetchLogs();
      } else {
        showMessage("Erreur : " + (result.error || "Échec de la régénération"), "error");
      }
    } catch (error) {
      showMessage("Erreur réseau lors de la régénération.", "error");
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
        showMessage(
          `Mode de génération par défaut : ${newMode === "HEADLESS" ? "Headless" : "html2pdf.js"}`,
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to update generation mode:", error);
      showMessage("Erreur lors de la mise à jour du mode.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
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

  const isSynchronized = status?.status === "synchronized";

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FileText size={26} />
            Générateur de CV
          </h1>
          <p className="text-muted-foreground mt-1">
            Prévisualisez votre CV et générez le fichier PDF prêt à être imprimé ou partagé.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isSynchronized
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
            }`}
          >
            {isSynchronized ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {isSynchronized ? "CV synchronisé" : "CV désynchronisé"}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground">
            <History size={14} />
            {status?.lastCvGeneratedAt
              ? `Dernière gén. ${formatDate(status.lastCvGeneratedAt)}`
              : "Jamais généré"}
          </div>
        </div>
      </div>

      {/* Alert message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Preview zone */}
        <div className="space-y-4">
          {/* Preview tabs */}
          <div className="flex items-center justify-between">
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
            <span className="text-xs text-muted-foreground">
              {mode === "screen" ? "Zoom confortable" : "Taille réelle A4"}
            </span>
          </div>

          {/* Canvas */}
          <div className="overflow-auto bg-gray-100 dark:bg-muted rounded-xl border border-border flex justify-center min-h-[600px] p-4">
            <div
              ref={cvRef}
              className={`shadow-lg ${mode === "screen" ? "scale-[0.92] origin-top" : ""}`}
              style={mode === "screen" ? { transform: "scale(0.92)", transformOrigin: "top center" } : {}}
            >
              <CVPrintTemplate
                profile={{
                  ...data.profile,
                  ...cvForm,
                  // Use public profile values as placeholders for empty cvPrint fields in the live preview
                  cvPrintFullName: cvForm.cvPrintFullName || data.profile.fullName,
                  cvPrintTitle: cvForm.cvPrintTitle || data.profile.title,
                  cvPrintEmail: cvForm.cvPrintEmail || data.profile.email,
                  cvPrintPhone: cvForm.cvPrintPhone || data.profile.phone,
                  cvPrintLocation: cvForm.cvPrintLocation || data.profile.location,
                  cvPrintLinkedin: cvForm.cvPrintLinkedin || data.profile.linkedin,
                  cvPrintWebsite: cvForm.cvPrintWebsite || "abdenour-hellas.online",
                  cvPrintBio: cvForm.cvPrintBio || data.profile.bio,
                }}
                experiences={data.experiences || []}
                education={data.education || []}
                skills={data.skills || []}
                projects={data.projects || []}
                certifications={data.certifications || []}
              />
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="space-y-5">
          {/* Status card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Statut du CV
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">État</span>
                <span
                  className={`inline-flex items-center gap-1.5 font-medium ${
                    isSynchronized ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isSynchronized ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {isSynchronized ? "Synchronisé" : "Désynchronisé"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Template React</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {status?.templateHash ? status.templateHash.slice(0, 8) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">HTML statique</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {status?.htmlHash ? status.htmlHash.slice(0, 8) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dernière synchro</span>
                <span className="text-muted-foreground">{formatDate(status?.cvLastSyncedAt || null)}</span>
              </div>
              {!isSynchronized && status?.reason && (
                <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
                  {status.reason}
                </p>
              )}
            </div>
          </section>

          {/* Content card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Pencil size={18} className="text-primary" />
                Contenu du CV
              </h2>
              {formChanged && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-2 py-1 rounded-full">
                  Modifications non enregistrées
                </span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nom complet</label>
                <input
                  type="text"
                  value={cvForm.cvPrintFullName}
                  onChange={(e) => updateFormField("cvPrintFullName", e.target.value)}
                  placeholder={data.profile.fullName}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Titre / poste</label>
                <input
                  type="text"
                  value={cvForm.cvPrintTitle}
                  onChange={(e) => updateFormField("cvPrintTitle", e.target.value)}
                  placeholder={data.profile.title}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={cvForm.cvPrintEmail}
                    onChange={(e) => updateFormField("cvPrintEmail", e.target.value)}
                    placeholder={data.profile.email}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintPhone}
                    onChange={(e) => updateFormField("cvPrintPhone", e.target.value)}
                    placeholder={data.profile.phone}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Localisation</label>
                <input
                  type="text"
                  value={cvForm.cvPrintLocation}
                  onChange={(e) => updateFormField("cvPrintLocation", e.target.value)}
                  placeholder={data.profile.location}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintLinkedin}
                    onChange={(e) => updateFormField("cvPrintLinkedin", e.target.value)}
                    placeholder={data.profile.linkedin}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Site web</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintWebsite}
                    onChange={(e) => updateFormField("cvPrintWebsite", e.target.value)}
                    placeholder="abdenour-hellas.online"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Bio / profil</label>
                <textarea
                  value={cvForm.cvPrintBio}
                  onChange={(e) => updateFormField("cvPrintBio", e.target.value)}
                  placeholder={data.profile.bio}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Laissez un champ vide pour utiliser la valeur du profil public.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveCvContent}
                  disabled={saving || !formChanged}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={resetForm}
                  disabled={!formChanged}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border bg-background text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={16} />
                  Réinitialiser
                </button>
              </div>
            </div>
          </section>

          {/* Actions card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Actions PDF
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleDownloadHtml2Pdf}
                disabled={generating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                {generating ? "Génération..." : "Télécharger le PDF"}
              </button>

              <button
                onClick={handlePrint}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-background text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <Printer size={16} />
                Imprimer
              </button>

              <button
                onClick={handleRegenerateHeadless}
                disabled={regenerating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-primary text-primary bg-primary/5 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                {regenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {regenerating ? "Régénération..." : "Régénérer le PDF (headless)"}
              </button>
            </div>
          </section>

          {/* Settings card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings2 size={18} className="text-primary" />
              Paramètres
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2">Mode de génération par défaut</label>
              <select
                value={status?.cvGenerationMode || "HEADLESS"}
                onChange={(e) => handleModeChange(e.target.value as "HEADLESS" | "HTML2PDF")}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
              >
                <option value="HEADLESS">Headless (Edge/Chrome serveur)</option>
                <option value="HTML2PDF">html2pdf.js (navigateur client)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                Headless produit un PDF identique au template HTML statique. html2pdf.js fonctionne partout.
              </p>
            </div>
          </section>

          {/* History card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <History size={18} className="text-primary" />
              Historique des générations
            </h2>
            {logsLoading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune génération enregistrée.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg text-xs border ${
                      log.success
                        ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                        : "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">
                        {log.method === "HEADLESS" ? "Headless" : "html2pdf.js"}
                      </span>
                      <span className={log.success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                        {log.success ? "Succès" : "Échec"}
                      </span>
                    </div>
                    <div className="text-muted-foreground">{formatDate(log.generatedAt)}</div>
                    {log.fileSizeKb ? (
                      <div className="text-muted-foreground">{log.fileSizeKb} Ko</div>
                    ) : null}
                    {log.error ? <div className="text-red-600 mt-1">{log.error}</div> : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
