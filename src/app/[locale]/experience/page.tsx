"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Experience } from "@/types";
import { Briefcase } from "lucide-react";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const reducedMotion = useReducedMotion();

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
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 md:h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Expériences Professionnelles</h1>
        <p className="text-muted-foreground">Impossible de charger les expériences. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Expériences Professionnelles</h1>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2" />

          {/* Mobile vertical line */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-12"
            >
              {/* Mobile layout */}
              <div className="md:hidden flex gap-4">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background mt-2" />
                </div>
                <div className="flex-1 p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors">
                  <DateBadge exp={exp} />
                  <h3 className="text-lg font-semibold mt-2">{exp.title}</h3>
                  <p className="text-secondary font-medium text-sm">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mb-2">{exp.location}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>
              </div>

              {/* Desktop layout */}
              <div className={`hidden md:flex flex-1 ${index % 2 === 0 ? "flex-row-reverse" : ""}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? "pl-8" : "pr-8"}`}>
                  <div className="p-5 rounded-xl bg-card border border-border hover:border-primary transition-colors hover:shadow-lg">
                    <DateBadge exp={exp} />
                    <h3 className="text-lg font-semibold mt-2">{exp.title}</h3>
                    <p className="text-secondary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-2">{exp.location}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 mt-6">
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background" />
                </div>
                <div className="w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function DateBadge({ exp }: { exp: Experience }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
      <Briefcase size={12} />
      {new Date(exp.startDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" })} -{" "}
      {exp.current
        ? "Présent"
        : exp.endDate
        ? new Date(exp.endDate).toLocaleDateString("fr-CA", { month: "short", year: "numeric" })
        : ""}
    </span>
  );
}
