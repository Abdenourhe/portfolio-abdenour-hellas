"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skill } from "@/types";
import { SkeletonCard } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import AnimatedSection, { fadeUpItem } from "@/components/public/AnimatedSection";

const categoryLabels: Record<string, string> = {
  logiciel: "skills.software",
  technique: "skills.technical",
  langue: "skills.language",
  soft: "skills.soft",
};

interface SkillsSectionProps {
  data?: Skill[];
  compact?: boolean;
  limit?: number;
}

export default function SkillsSection({ data, compact = false, limit }: SkillsSectionProps) {
  const t = useT();
  const [skills, setSkills] = useState<Skill[]>(data || []);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) return;
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSkills(data);
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

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-muted-foreground">{t("common.error")}</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => {
        const displaySkills = limit ? categorySkills.slice(0, limit) : categorySkills;
        return (
          <div key={category}>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-base font-semibold text-primary mb-5 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-secondary" />
              {t(categoryLabels[category] || category)}
            </motion.h3>
            <AnimatedSection stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {displaySkills.map((skill) => (
                <motion.div key={skill.id} variants={fadeUpItem}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-base font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm text-secondary font-medium tabular-nums">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        );
      })}
    </div>
  );
}
