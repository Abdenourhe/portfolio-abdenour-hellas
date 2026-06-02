"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Printer } from "lucide-react";

export default function CVPage() {
  const reducedMotion = useReducedMotion();

  const handleDownload = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cv_download" }),
    });
    window.open("/uploads/cv.pdf", "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Curriculum Vitae</h1>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-6 md:mb-8">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base"
            >
              <Download size={16} />
              Télécharger PDF
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm md:text-base"
            >
              <Printer size={16} />
              Imprimer
            </button>
          </div>

          <div className="bg-white dark:bg-card text-foreground p-6 md:p-10 lg:p-12 rounded-xl border border-border shadow-lg print:shadow-none print:border-0">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Abdenour Hellas</h2>
              <p className="text-lg md:text-xl text-primary mt-2">Ingénieur en Génie Électrique</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs md:text-sm text-muted-foreground">
                <span>Abdenour.Hellas@uqat.ca</span>
                <span>418-350-5686</span>
                <span className="hidden md:inline">·</span>
                <span>3490 Rue Principale, Baker-Brook, NB E7A 1Z6</span>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold border-b-2 border-primary pb-2 mb-3 md:mb-4">PROFIL</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Déterminé, sérieux, autonome et conscient du travail qui m&apos;attend, 
                je suis persuadé que je serais un élément moteur au sein de votre structure !
              </p>
            </div>

            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold border-b-2 border-primary pb-2 mb-3 md:mb-4">FORMATION</h3>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <h4 className="font-medium text-sm md:text-base">M.D. Génie Électrique</h4>
                    <span className="text-xs md:text-sm text-muted-foreground">2023 - 2025</span>
                  </div>
                  <p className="text-primary text-sm md:text-base">UQAT, Rouyn-Noranda, QC</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Réalisation d&apos;un radar avancé</p>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <h4 className="font-medium text-sm md:text-base">Master Électromécanique</h4>
                    <span className="text-xs md:text-sm text-muted-foreground">2018 - 2020</span>
                  </div>
                  <p className="text-primary text-sm md:text-base">Université de Batna 2, Algérie</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Étude et réalisation d&apos;un radar commandé par PIC</p>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <h4 className="font-medium text-sm md:text-base">Licence Électromécanique</h4>
                    <span className="text-xs md:text-sm text-muted-foreground">2015 - 2018</span>
                  </div>
                  <p className="text-primary text-sm md:text-base">Université de Batna 2, Algérie</p>
                </div>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold border-b-2 border-primary pb-2 mb-3 md:mb-4">EXPÉRIENCES</h3>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <h4 className="font-medium text-sm md:text-base">Configurateur Électrique</h4>
                    <span className="text-xs md:text-sm text-muted-foreground">Déc 2025 - Mars 2026</span>
                  </div>
                  <p className="text-primary text-sm md:text-base">Maison La Prise, Québec, QC</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Configuration et dimensionnement d&apos;installations électriques</p>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <h4 className="font-medium text-sm md:text-base">Superviseur Département Électroménagers</h4>
                    <span className="text-xs md:text-sm text-muted-foreground">Avr 2024 - Nov 2025</span>
                  </div>
                  <p className="text-primary text-sm md:text-base">RONA, Rouyn-Noranda, QC</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold border-b-2 border-primary pb-2 mb-3 md:mb-4">COMPÉTENCES</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
