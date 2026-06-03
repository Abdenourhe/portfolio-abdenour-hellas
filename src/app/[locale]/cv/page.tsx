"use client";

import { motion } from "framer-motion";
import { Download, Printer } from "lucide-react";
import SectionHeader from "@/components/public/SectionHeader";

export default function CVPage() {
  const handleDownload = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
    window.open("/uploads/cv.pdf", "_blank");
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title="Curriculum Vitae" subtitle="Mon parcours académique et professionnel." />

      <div className="max-w-3xl mx-auto mt-10">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download size={14} />
            Télécharger PDF
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <Printer size={14} />
            Imprimer
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-card text-foreground p-8 md:p-12 rounded-xl border border-border print:shadow-none print:border-0 print:p-0"
        >
          <div className="text-center mb-8 pb-6 border-b border-border">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">Abdenour Hellas</h2>
            <p className="text-base text-secondary mt-1 font-medium">Ingénieur en Génie Électrique</p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 text-xs text-muted-foreground">
              <span>Abdenour.Hellas@uqat.ca</span>
              <span>·</span>
              <span>418-350-5686</span>
              <span>·</span>
              <span>Baker-Brook, NB</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-3">Profil</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Déterminé, sérieux, autonome et conscient du travail qui m&apos;attend,
              je suis persuadé que je serais un élément moteur au sein de votre structure.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-3">Formation</h3>
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                  <h4 className="font-medium text-sm text-foreground">M.D. Génie Électrique</h4>
                  <span className="text-xs text-muted-foreground">2023 — 2025</span>
                </div>
                <p className="text-sm text-primary">UQAT, Rouyn-Noranda, QC</p>
                <p className="text-xs text-muted-foreground mt-0.5">Réalisation d&apos;un radar avancé</p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                  <h4 className="font-medium text-sm text-foreground">Master Électromécanique</h4>
                  <span className="text-xs text-muted-foreground">2018 — 2020</span>
                </div>
                <p className="text-sm text-primary">Université de Batna 2, Algérie</p>
                <p className="text-xs text-muted-foreground mt-0.5">Étude et réalisation d&apos;un radar commandé par PIC</p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                  <h4 className="font-medium text-sm text-foreground">Licence Électromécanique</h4>
                  <span className="text-xs text-muted-foreground">2015 — 2018</span>
                </div>
                <p className="text-sm text-primary">Université de Batna 2, Algérie</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-3">Expériences</h3>
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                  <h4 className="font-medium text-sm text-foreground">Configurateur Électrique</h4>
                  <span className="text-xs text-muted-foreground">Déc 2025 — Mars 2026</span>
                </div>
                <p className="text-sm text-primary">Maison La Prise, Québec, QC</p>
                <p className="text-xs text-muted-foreground mt-0.5">Configuration et dimensionnement d&apos;installations électriques</p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                  <h4 className="font-medium text-sm text-foreground">Superviseur Département Électroménagers</h4>
                  <span className="text-xs text-muted-foreground">Avr 2024 — Nov 2025</span>
                </div>
                <p className="text-sm text-primary">RONA, Rouyn-Noranda, QC</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-3">Compétences</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Microsoft Office</span>
              <span>Proteus 8</span>
              <span>SolidWorks</span>
              <span>MATLAB</span>
              <span>Génie Électrique</span>
              <span>Électromécanique</span>
              <span>Réseaux Informatiques</span>
              <span>Maintenance Industrielle</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
