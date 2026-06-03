"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Experience } from "@/types";
import { Briefcase } from "lucide-react";
import { SkeletonList } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";

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

  if (compact) {
    return (
      <div className="max-w-3xl mx-auto space-y-3">
        {displayExperiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center mt-0.5">
              <Briefcase className="w-4 h-4 text-primary/70" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-primary">{exp.title}</h3>
                {exp.category && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium">
                    {categoryLabels[exp.category] || exp.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{exp.company} · {exp.location}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{exp.description}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-primary/60 mt-1.5">
                {new Date(exp.startDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" })} —{" "}
                {exp.current ? t("experience.present") : exp.endDate ? new Date(exp.endDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" }) : ""}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto relative">
      <div className="absolute left-4 md:left-0 md:right-0 md:mx-auto top-0 bottom-0 w-px bg-primary/20" />

      {displayExperiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="relative pl-12 md:pl-0 pb-10 last:pb-0"
        >
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-1.5 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-background" />

          <div className="md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8">
            <div className={`${index % 2 === 0 ? "md:text-right md:pr-8" : "md:col-start-3 md:pl-8"}`}>
              <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                    <Briefcase size={11} />
                    {new Date(exp.startDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" })} —{" "}
                    {exp.current ? t("experience.present") : exp.endDate ? new Date(exp.endDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" }) : ""}
                  </span>
                  {exp.category && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium">
                      {categoryLabels[exp.category] || exp.category}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-primary">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">{exp.company} · {exp.location}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
