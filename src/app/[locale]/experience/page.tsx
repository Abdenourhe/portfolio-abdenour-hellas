"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Experience } from "@/types";
import { Briefcase } from "lucide-react";
import SectionHeader from "@/components/public/SectionHeader";
import { SkeletonList } from "@/components/public/Skeleton";

const categoryColors: Record<string, string> = {
  tech: "bg-slate-500",
  commerce: "bg-stone-500",
  education: "bg-neutral-500",
};

const categoryLabels: Record<string, string> = {
  tech: "Technique",
  commerce: "Commerce",
  education: "Éducation",
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <SectionHeader title="Expériences" subtitle="Mon parcours professionnel et mes missions." />
        <div className="max-w-3xl mx-auto mt-12">
          <SkeletonList count={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 text-center">
        <SectionHeader title="Expériences" subtitle="" />
        <p className="mt-8 text-muted-foreground">Impossible de charger les expériences. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title="Expériences" subtitle="Mon parcours professionnel et mes missions." />

      <div className="max-w-3xl mx-auto mt-12 relative">
        <div className="absolute left-4 md:left-0 md:right-0 md:mx-auto top-0 bottom-0 w-px bg-border" />

        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="relative pl-12 md:pl-0 pb-10 last:pb-0"
          >
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-1.5 w-2 h-2 rounded-full bg-foreground ring-4 ring-background" />

            <div className="md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8">
              <div className={`${index % 2 === 0 ? "md:text-right md:pr-8" : "md:col-start-3 md:pl-8"}`}>
                <div className="p-5 rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      <Briefcase size={11} />
                      {new Date(exp.startDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" })} —{" "}
                      {exp.current ? "Présent" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" }) : ""}
                    </span>
                    {exp.category && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md text-white ${categoryColors[exp.category] || "bg-muted-foreground"}`}>
                        {categoryLabels[exp.category] || exp.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company} · {exp.location}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
