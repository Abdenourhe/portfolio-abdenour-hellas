"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Experience } from "@/types";
import { Briefcase, ExternalLink, ImageIcon } from "lucide-react";
import { SkeletonList } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import AnimatedSection, { fadeUpItem } from "@/components/public/AnimatedSection";
import ElectricCard from "@/components/public/ElectricCard";
import ImageLightbox from "@/components/public/ImageLightbox";

const categoryLabels: Record<string, string> = {
  tech: "Technique",
  commerce: "Commerce",
  education: "Éducation",
};

interface ExperienceSectionProps {
  data?: Experience[];
  compact?: boolean;
  limit?: number;
}

export default function ExperienceSection({ data, compact = false, limit }: ExperienceSectionProps) {
  const t = useT();
  const [experiences, setExperiences] = useState<Experience[]>(data || []);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");

  useEffect(() => {
    if (data) return;
    fetch("/api/experiences")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiences(data);
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
      <div className="max-w-3xl mx-auto">
        <SkeletonList count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-muted-foreground">{t("common.error")}</p>
    );
  }

  const displayExperiences = limit ? experiences.slice(0, limit) : experiences;

  return (
    <>
      <AnimatedSection stagger={0.1} className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-primary/35" />

        {displayExperiences.map((exp) => (
          <motion.div
            key={exp.id}
            variants={fadeUpItem}
            className="relative pl-10 md:pl-14 pb-8 last:pb-0"
          >
            {/* Dot */}
            <div className="absolute left-2 md:left-3 top-2 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-secondary ring-4 ring-background" />

            {/* Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group"
            >
              <ElectricCard className="rounded-xl h-full">
                <div className={`bg-card hover:shadow-lg transition-all h-full rounded-xl ${compact ? "p-4" : "p-5"}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/15 px-2 py-0.5 rounded-md">
                      <Briefcase size={11} />
                      {new Date(exp.startDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" })} —{" "}
                      {exp.current ? t("experience.present") : exp.endDate ? new Date(exp.endDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" }) : ""}
                    </span>
                    {exp.category && (
                      <span className="text-xs px-1.5 py-0.5 rounded-md bg-secondary/20 text-secondary font-medium">
                        {categoryLabels[exp.category] || exp.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-primary">{exp.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{exp.company} · {exp.location}</p>
                  <p className={`text-muted-foreground leading-relaxed mt-2 ${compact ? "text-sm line-clamp-2" : "text-sm md:text-base"}`}>
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.url && (
                      <a
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/15 hover:bg-primary/25 px-2 py-1 rounded-md transition-colors"
                      >
                        <ExternalLink size={10} />
                        Attestation
                      </a>
                    )}
                    {exp.certificateImage && (
                      <button
                        onClick={() => openImage(exp.certificateImage!)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1A3D25] bg-[#D4EFDA] hover:bg-[#C5E8CE] dark:bg-[#1A3D25] dark:text-[#8FCF9B] dark:hover:bg-[#163820] px-2 py-1 rounded-md transition-colors"
                      >
                        <ImageIcon size={10} />
                        Voir attestation
                      </button>
                    )}
                  </div>
                </div>
              </ElectricCard>
            </motion.div>
          </motion.div>
        ))}
      </AnimatedSection>
      <ImageLightbox
        src={lightboxSrc}
        alt="Attestation"
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
