"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Education } from "@/types";
import { Plus, Pencil, Trash2, GripVertical, Upload, ImageIcon } from "lucide-react";
import SpellCheck from "@/components/admin/SpellCheck";

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
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Diplôme"
                value={form.degree || ""}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                required
              />
              <SpellCheck text={form.degree || ""} onApply={(v) => setForm({ ...form, degree: v })} />
            </div>
            <div className="space-y-1">
              <input
                type="text"
                placeholder="École"
                value={form.school || ""}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                required
              />
              <SpellCheck text={form.school || ""} onApply={(v) => setForm({ ...form, school: v })} />
            </div>
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Lieu"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
              <SpellCheck text={form.location || ""} onApply={(v) => setForm({ ...form, location: v })} />
            </div>
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
            <input
              type="url"
              placeholder="Lien du certificat (URL)"
              value={form.url || ""}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <Upload size={16} />
                <span>{form.certificateImage ? "Changer l'image" : "Uploader image certificat"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => setForm({ ...form, certificateImage: reader.result as string });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {form.certificateImage && (
                <div className="relative w-32 h-20 rounded-lg border border-border overflow-hidden">
                  <img src={form.certificateImage} alt="Aperçu certificat" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, certificateImage: "" })}
                    className="absolute top-1 right-1 p-1 rounded bg-black/50 text-white hover:bg-black/70"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
          />
          <SpellCheck text={form.description || ""} onApply={(v) => setForm({ ...form, description: v })} />
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
              <p className="text-sm text-muted-foreground">{edu.school} · {edu.location}{edu.url ? " · " : ""}{edu.url && <a href={edu.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Certificat ↗</a>}{edu.certificateImage && <span className="inline-flex items-center gap-1 ml-2 text-xs text-[#1A3D25]"><ImageIcon size={12} /> Image</span>}</p>
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
