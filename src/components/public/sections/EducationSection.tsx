"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Education } from "@/types";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { SkeletonList } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";

interface EducationSectionProps {
  data?: Education[];
}

export default function EducationSection({ data }: EducationSectionProps) {
  const t = useT();
  const [education, setEducation] = useState<Education[]>(data || []);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {education.map((edu, index) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="flex gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center mt-0.5">
            <GraduationCap className="w-4 h-4 text-primary/70" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-primary">{edu.degree}</h3>
            <p className="text-sm text-muted-foreground">{edu.school}</p>
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
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{edu.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
