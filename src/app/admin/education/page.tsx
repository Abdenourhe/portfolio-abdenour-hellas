"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Education } from "@/types";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<any>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = () => {
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        setEducation(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch("/api/education", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setForm({});
    setAdding(false);
    fetchEducation();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette formation ?")) return;
    await fetch(`/api/education?id=${id}`, { method: "DELETE" });
    fetchEducation();
  };

  const handleEdit = (edu: Education) => {
    setEditing(edu);
    setForm({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : "" as any,
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : "" as any,
    });
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
        <h1 className="text-3xl font-bold">Formations</h1>
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
          <h2 className="text-lg font-semibold">{editing ? "Modifier" : "Nouvelle formation"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Diplôme"
              value={form.degree || ""}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="École"
              value={form.school || ""}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Lieu"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <input
              type="date"
              value={(form.startDate as any) || ""}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              required
            />
            <input
              type="date"
              value={(form.endDate as any) || ""}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.current || false}
                onChange={(e) => setForm({ ...form, current: e.target.checked })}
                className="rounded"
              />
              En cours
            </label>
          </div>
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
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
        {education.map((edu) => (
          <div
            key={edu.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
          >
            <GripVertical className="text-muted-foreground cursor-move" size={18} />
            <div className="flex-1">
              <h3 className="font-medium">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.school} · {edu.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(edu)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
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
