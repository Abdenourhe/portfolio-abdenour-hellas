"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Skill } from "@/types";
import { Plus, Pencil, Trash2, GripVertical, Tag, ChevronDown, ChevronUp, FolderEdit } from "lucide-react";
import SpellCheck from "@/components/admin/SpellCheck";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Partial<Skill>>({});
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSkills(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const categories = useMemo(() => {
    const cats = new Set(skills.map((s) => s.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [skills]);

  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    skills.forEach((s) => {
      const cat = s.category || "Sans catégorie";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [skills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const category = form.category === "__new__" ? newCategory.trim() : form.category;
    if (!category) return;

    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id, category } : { ...form, category };

    await fetch("/api/skills", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setForm({});
    setAdding(false);
    setNewCategory("");
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
    setAdding(false);
  };

  const handleRenameCategory = async (oldCat: string) => {
    if (!renameValue.trim() || renameValue.trim() === oldCat) {
      setRenamingCategory(null);
      return;
    }
    await fetch("/api/skills/category", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldCategory: oldCat, newCategory: renameValue.trim() }),
    });
    setRenamingCategory(null);
    setRenameValue("");
    fetchSkills();
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
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
          onClick={() => { setEditing(null); setForm({ category: categories[0] || "" }); setAdding(true); }}
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
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Nom"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                required
              />
              <SpellCheck text={form.name || ""} onApply={(v) => setForm({ ...form, name: v })} />
            </div>
            <div className="space-y-1">
              <select
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                required
              >
                <option value="">Choisir une catégorie...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__new__">+ Nouvelle catégorie</option>
              </select>
              {form.category === "__new__" && (
                <input
                  type="text"
                  placeholder="Nom de la nouvelle catégorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  required
                />
              )}
            </div>
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
              onClick={() => { setEditing(null); setForm({}); setAdding(false); setNewCategory(""); }}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, catSkills]) => (
          <div key={category} className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Category header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary"
              >
                <Tag size={14} />
                {category}
                <span className="text-xs text-muted-foreground font-normal">({catSkills.length})</span>
                {collapsedCategories[category] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              {renamingCategory === category ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="px-2 py-1 text-sm rounded border border-border bg-background"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleRenameCategory(category); if (e.key === "Escape") setRenamingCategory(null); }}
                  />
                  <button onClick={() => handleRenameCategory(category)} className="text-xs text-primary hover:underline">OK</button>
                  <button onClick={() => setRenamingCategory(null)} className="text-xs text-muted-foreground hover:underline">Annuler</button>
                </div>
              ) : (
                <button
                  onClick={() => { setRenamingCategory(category); setRenameValue(category); }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <FolderEdit size={12} />
                  Renommer
                </button>
              )}
            </div>

            {/* Skills list */}
            {!collapsedCategories[category] && (
              <div className="divide-y divide-border">
                {catSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <GripVertical className="text-muted-foreground cursor-move shrink-0" size={18} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{skill.name}</h3>
                      <p className="text-sm text-muted-foreground">{skill.level}% · Icône: {skill.icon || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
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
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
