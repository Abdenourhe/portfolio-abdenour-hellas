"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Skill } from "@/types";
import { FileText, Cpu, Box, BarChart3, Zap, Settings, Network, Wrench, Radar, Globe, Users, UserCheck, UsersRound, ShieldCheck } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  FileText, Cpu, Box, BarChart3, Zap, Settings, Network, Wrench, Radar, Globe, Users, UserCheck, UsersRound, ShieldCheck,
};

const categoryColors: Record<string, string> = {
  logiciel: "bg-blue-500",
  technique: "bg-orange-500",
  langue: "bg-green-500",
  soft: "bg-purple-500",
};

const categoryLabels: Record<string, string> = {
  logiciel: "Logiciels",
  technique: "Techniques",
  langue: "Langues",
  soft: "Soft Skills",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      });
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Compétences</h1>

        <div className="max-w-4xl mx-auto space-y-10 md:space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: catIndex * 0.1 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${categoryColors[category] || "bg-primary"}`} />
                {categoryLabels[category] || category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {categorySkills.map((skill, index) => {
                  const IconComponent = skill.icon ? iconMap[skill.icon] : null;
                  return (
                    <motion.div
                      key={skill.id}
                      initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="p-3 md:p-4 rounded-xl bg-card border border-border"
                    >
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        {IconComponent && <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />}
                        <span className="font-medium text-sm md:text-base truncate">{skill.name}</span>
                        <span className="ml-auto text-xs md:text-sm text-muted-foreground flex-shrink-0">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={reducedMotion ? {} : { width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                          className={`h-full rounded-full ${categoryColors[category] || "bg-primary"}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
