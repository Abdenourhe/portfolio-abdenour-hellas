"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Printer, Loader2 } from "lucide-react";
import { useT } from "@/components/public/I18nProvider";
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
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleDownload = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
    const cvUrl = data?.profile?.cvUrl || "/cv/Abdenour_Hellas_CV.pdf";
    window.open(cvUrl, "_blank");
  };

  const handlePrint = () => {
    window.print();
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

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16 print:p-0 print:m-0">
      {/* Actions */}
      <div className="max-w-[210mm] mx-auto mb-6 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors min-h-[48px]"
        >
          <Download size={16} /> {t("cv.download")}
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-3 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.02] transition-colors min-h-[48px]"
        >
          <Printer size={16} /> {t("cv.print")}
        </button>
      </div>

      {/* CV Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-auto flex justify-center print:block print:p-0 print:m-0 print:overflow-visible"
      >
        <div ref={cvRef} className="shadow-lg print:shadow-none">
          <CVPrintTemplate
            profile={profile}
            experiences={experiences || []}
            education={education || []}
            skills={skills || []}
            projects={projects || []}
            certifications={certifications || []}
          />
        </div>
      </motion.div>
    </div>
  );
}
