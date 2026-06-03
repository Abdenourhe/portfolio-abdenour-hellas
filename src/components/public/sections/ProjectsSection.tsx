"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import { ExternalLink, Code, Star, FolderGit } from "lucide-react";
import { Skeleton } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import AnimatedSection, { fadeUpItem } from "@/components/public/AnimatedSection";

function ProjectPlaceholder({ title }: { title: string }) {
  return (
    <div className="w-full h-44 md:h-52 bg-muted flex flex-col items-center justify-center border-b border-border">
      <FolderGit className="w-10 h-10 text-primary/20 mb-2" />
      <span className="text-xs text-primary/40 text-center px-4">{title}</span>
    </div>
  );
}

interface ProjectsSectionProps {
  data?: Project[];
  compact?: boolean;
  limit?: number;
}

export default function ProjectsSection({ data, compact = false, limit }: ProjectsSectionProps) {
  const t = useT();
  const [projects, setProjects] = useState<Project[]>(data || []);
  const displayProjects = limit ? projects.slice(0, limit) : projects;
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) return;
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
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
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <Skeleton className="h-44 md:h-52 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
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

  return (
    <AnimatedSection stagger={0.1} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
      {displayProjects.map((project) => (
        <motion.div
          key={project.id}
          variants={fadeUpItem}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all"
        >
          {project.imageUrl ? (
            <div className="w-full h-44 md:h-52 overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </div>
          ) : (
            <ProjectPlaceholder title={project.title} />
          )}
          <div className={compact ? "p-4" : "p-5"}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-primary group-hover:text-primary/80 transition-colors">
                {project.title}
              </h3>
              {project.featured && (
                <Star className="w-3.5 h-3.5 text-secondary fill-secondary flex-shrink-0 ml-2 mt-0.5" />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-primary/5 text-primary/80"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-primary/5 text-primary/80">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
            <div className="flex gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-secondary transition-colors"
                >
                  <ExternalLink size={12} />
                  {t("projects.viewProject")}
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Code size={12} />
                  {t("projects.sourceCode")}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatedSection>
  );
}
