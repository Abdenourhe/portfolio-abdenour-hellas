"use client";

import { useEffect, useState } from "react";
import { Loader2, Printer, ArrowLeft } from "lucide-react";
import { useT } from "@/components/public/I18nProvider";
import CVPrintTemplate from "@/components/public/CVPrintTemplate";

interface CVData {
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  projects: any[];
}

export default function CVPrintPage() {
  const t = useT();
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then(({ profile, experiences, education, skills, projects }) => {
        setData({ profile, experiences, education, skills, projects });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background">
        <p className="text-muted-foreground">{t("common.error")}</p>
      </div>
    );
  }

  const { profile, experiences, education, skills, projects } = data;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background print:bg-white print:min-h-0">
      {/* Toolbar - hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 bg-white/90 dark:bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-[210mm] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a
            href="/fr/cv"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Retour au CV
          </a>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Printer size={16} />
            Imprimer / Enregistrer PDF
          </button>
        </div>
      </div>

      {/* CV Sheet */}
      <div className="py-6 flex justify-center print:p-0 print:m-0 print:block">
        <div className="shadow-xl print:shadow-none">
          <CVPrintTemplate
            profile={profile}
            experiences={experiences || []}
            education={education || []}
            skills={skills || []}
            projects={projects || []}
          />
        </div>
      </div>
    </div>
  );
}
