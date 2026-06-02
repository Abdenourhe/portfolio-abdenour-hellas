"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Education } from "@/types";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Formations</h1>
        <p className="text-muted-foreground">Impossible de charger les formations. Veuillez réessayer plus tard.</p>
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Formations</h1>

        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-card border border-border hover:border-primary transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-xl font-semibold">{edu.degree}</h3>
                <p className="text-primary font-medium text-sm md:text-base">{edu.school}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs md:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(edu.startDate).toLocaleDateString("fr-CA", { year: "numeric", month: "short" })} -{" "}
                    {edu.current
                      ? "Présent"
                      : edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString("fr-CA", { year: "numeric", month: "short" })
                      : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {edu.location}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{edu.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
