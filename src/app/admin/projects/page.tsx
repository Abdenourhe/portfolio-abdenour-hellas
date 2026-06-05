"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import { Plus, Pencil, Trash2, GripVertical, Star } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch("/api/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setForm({});
    setAdding(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm(project);
  };

  const toggleFeatured = async (project: Project) => {
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id, featured: !project.featured }),
    });
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projets</h1>
        <button
          onClick={() => { setEditing(null); setForm({}); setAdding(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {(editing || adding) && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl bg-card border border-border space-y-4">
          <h2 className="text-lg font-semibold">{editing ? "Modifier" : "Nouveau projet"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Titre"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Technologies (séparées par des virgules)"
              value={Array.isArray(form.technologies) ? form.technologies.join(", ") : form.technologies || ""}
              onChange={(e) => setForm({ ...form, technologies: e.target.value.split(",").map((t) => t.trim()) })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Catégorie (ex: Automatisation, IoT, Web)"
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="URL GitHub"
              value={form.githubUrl || ""}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="URL Démo"
              value={form.demoUrl || ""}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={form.featured || false}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              Projet à la une
            </label>
          </div>
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              {editing ? "Mettre à jour" : "Créer"}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(null); setForm({}); setAdding(false); }}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
          >
            <GripVertical className="text-muted-foreground cursor-move" size={18} />
            <div className="flex-1">
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.technologies.join(", ")}</p>
            </div>
            <button
              onClick={() => toggleFeatured(project)}
              className={`p-2 rounded-lg transition-colors ${project.featured ? "text-secondary" : "text-muted-foreground hover:text-secondary"}`}
            >
              <Star size={16} className={project.featured ? "fill-secondary" : ""} />
            </button>
            <button
              onClick={() => handleEdit(project)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(project.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
