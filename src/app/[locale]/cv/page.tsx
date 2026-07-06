"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { useT } from "@/components/public/I18nProvider";
import { useLocale } from "@/hooks/useLocale";
import CVPrintTemplate from "@/components/public/CVPrintTemplate";

interface CVData {
  profile: any;
  experiences: any[];
  education: any[];
  certifications: any[];
  skills: any[];
  projects: any[];
}

export default function CVPage() {
  const t = useT();
  const locale = useLocale();
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then(({ profile, experiences, education, certifications, skills, projects }) => {
        setData({ profile, experiences, education, certifications, skills, projects });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const trackDownload = async () => {
    try {
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cv_download" }),
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadGenerated = async () => {
    if (!cvRef.current) return;
    setGenerating(true);
    await trackDownload();
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0,
        filename: `${data?.profile?.fullName || "CV"}_A4.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
        pagebreak: { mode: ["css", "legacy"] },
      };
      await html2pdf().set(opt).from(cvRef.current).save();
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadUploaded = async (cvUrl: string) => {
    await trackDownload();
    window.open(cvUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 text-center">
        <p className="text-muted-foreground">{t("common.error")}</p>
      </div>
    );
  }

  const { profile, experiences, education, certifications, skills, projects } = data;
  const cvUrl = profile?.cvUrl;
  const displayLocale: "fr" | "en" | "ar" = (locale === "en" || locale === "ar") ? locale : "fr";

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background: white; }
          #cv-print-content { box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16 print:p-0 print:m-0">
        {/* Actions */}
        <div className="max-w-[210mm] mx-auto mb-8 flex flex-wrap justify-center gap-3 no-print">
          {cvUrl ? (
            <button
              onClick={() => handleDownloadUploaded(cvUrl)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors min-h-[48px]"
            >
              <Download size={16} />
              {t("contact.downloadCv")}
            </button>
          ) : (
            <button
              onClick={handleDownloadGenerated}
              disabled={generating}
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]"
            >
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {generating ? "Génération..." : t("contact.downloadCv")}
            </button>
          )}
        </div>

        {/* CV */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center print:block print:p-0 print:m-0"
        >
          {cvUrl ? (
            <div className="w-full max-w-[210mm] bg-white shadow-lg print:shadow-none overflow-hidden rounded-sm">
              <iframe
                src={cvUrl}
                title="CV PDF"
                className="w-full h-[297mm] border-0"
              />
            </div>
          ) : (
            <div ref={cvRef} className="shadow-lg print:shadow-none">
              <CVPrintTemplate
                profile={profile}
                experiences={experiences || []}
                education={education || []}
                skills={skills || []}
                projects={projects || []}
                certifications={certifications || []}
                locale={displayLocale}
              />
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
