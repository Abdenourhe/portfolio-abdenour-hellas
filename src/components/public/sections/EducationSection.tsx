"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Education } from "@/types";
import { GraduationCap, Calendar, MapPin, ExternalLink, ImageIcon } from "lucide-react";
import { SkeletonList } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import AnimatedSection, { fadeUpItem } from "@/components/public/AnimatedSection";
import ElectricCard from "@/components/public/ElectricCard";
import ImageLightbox from "@/components/public/ImageLightbox";

interface EducationSectionProps {
  data?: Education[];
  compact?: boolean;
  limit?: number;
}

export default function EducationSection({ data, compact = false, limit }: EducationSectionProps) {
  const t = useT();
  const [education, setEducation] = useState<Education[]>(data || []);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");

  useEffect(() => {
    if (data) return;
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEducation(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [data]);

  const openImage = (src: string) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-emerald-50/50 dark:bg-card p-5 space-y-3">
            <SkeletonList count={1} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-muted-foreground">{t("common.error")}</p>
    );
  }

  const displayEducation = limit ? education.slice(0, limit) : education;

  return (
    <>
      <AnimatedSection stagger={0.1} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayEducation.map((edu) => (
          <motion.div
            key={edu.id}
            variants={fadeUpItem}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <ElectricCard className="rounded-xl h-full">
              <div className={`bg-emerald-50/50 dark:bg-card hover:shadow-lg transition-all h-full rounded-xl ${compact ? "p-4" : "p-5"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center mt-0.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600/70 dark:text-emerald-400/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-primary">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{edu.school}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(edu.startDate).toLocaleDateString("fr-CA", { year: "numeric", month: "short" })} —{" "}
                        {edu.current
                          ? t("experience.present")
                          : edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString("fr-CA", { year: "numeric", month: "short" })
                          : ""}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={10} />
                        {edu.location}
                      </span>
                    </div>
                    {edu.description && (
                      <p className={`text-muted-foreground mt-2 ${compact ? "text-sm line-clamp-2" : "text-sm leading-relaxed"}`}>
                        {edu.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {edu.url && (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/15 hover:bg-primary/25 px-2 py-1 rounded-md transition-colors"
                        >
                          <ExternalLink size={10} />
                          Certificat
                        </a>
                      )}
                      {edu.certificateImage && (
                        <button
                          onClick={() => openImage(edu.certificateImage!)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-2 py-1 rounded-md transition-colors"
                        >
                          <ImageIcon size={10} />
                          Voir certificat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ElectricCard>
          </motion.div>
        ))}
      </AnimatedSection>
      <ImageLightbox
        src={lightboxSrc}
        alt="Certificat"
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}