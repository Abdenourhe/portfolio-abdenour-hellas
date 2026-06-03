"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skill } from "@/types";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Partial<Skill>>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch("/api/skills", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setForm({});
    setAdding(false);
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette compétence ?")) return;
    await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
    fetchSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditing(skill);
    setForm(skill);
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
        <h1 className="text-3xl font-bold">Compétences</h1>
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
          <h2 className="text-lg font-semibold">{editing ? "Modifier" : "Nouvelle compétence"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Catégorie (logiciel, technique, langue, soft)"
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Niveau (0-100)"
              min="0"
              max="100"
              value={form.level || 80}
              onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Icône (nom Lucide)"
              value={form.icon || ""}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
          </div>
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
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
          >
            <GripVertical className="text-muted-foreground cursor-move" size={18} />
            <div className="flex-1">
              <h3 className="font-medium">{skill.name}</h3>
              <p className="text-sm text-muted-foreground">{skill.category} · {skill.level}%</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
