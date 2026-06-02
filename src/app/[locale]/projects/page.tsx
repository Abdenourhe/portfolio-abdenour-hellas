"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Project } from "@/types";
import { ExternalLink, Code, Star, FolderGit } from "lucide-react";

function ProjectPlaceholder({ title }: { title: string }) {
  return (
    <div className="w-full h-40 md:h-48 bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center rounded-t-xl border-b border-border">
      <FolderGit className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/40 mb-2" />
      <span className="text-xs md:text-sm text-muted-foreground/60 text-center px-4">{title}</span>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 md:h-72 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Projets</h1>
        <p className="text-muted-foreground">Impossible de charger les projets. Veuillez réessayer plus tard.</p>
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Projets</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative rounded-xl bg-card border border-border overflow-hidden hover:border-primary transition-all hover:shadow-lg"
            >
              {project.imageUrl ? (
                <div className="w-full h-40 md:h-48 bg-cover bg-center" style={{ backgroundImage: `url(${project.imageUrl})` }} />
              ) : (
                <ProjectPlaceholder title={project.title} />
              )}
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <h3 className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-secondary fill-secondary flex-shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink size={14} />
                      Voir le projet
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Code size={14} />
                      Code source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
