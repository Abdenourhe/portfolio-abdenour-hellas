"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skill } from "@/types";
import { FileText, Cpu, Box, BarChart3, Zap, Settings, Network, Wrench, Radar, Globe, Users, UserCheck, UsersRound, ShieldCheck } from "lucide-react";
import { SkeletonCard } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";

const iconMap: Record<string, React.ElementType> = {
  FileText, Cpu, Box, BarChart3, Zap, Settings, Network, Wrench, Radar, Globe, Users, UserCheck, UsersRound, ShieldCheck,
};

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
    <div className="max-w-4xl mx-auto space-y-14">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-base font-semibold text-primary mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            {t(categoryLabels[category] || category)}
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${compact ? "md:grid-cols-3 gap-2" : ""}`}>
            {(() => {
              const displaySkills = limit ? categorySkills.slice(0, limit) : categorySkills;
              return displaySkills.map((skill, index) => {
              const IconComponent = skill.icon ? iconMap[skill.icon] : null;
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`rounded-xl border border-border bg-card hover:border-primary/30 transition-colors ${compact ? "p-3" : "p-4"}`}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    {IconComponent && <IconComponent className="w-4 h-4 text-primary/60 flex-shrink-0" />}
                    <span className="text-sm font-medium text-foreground flex-1 truncate">{skill.name}</span>
                    <span className="text-xs text-secondary font-medium tabular-nums">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              );
            });
            })()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
