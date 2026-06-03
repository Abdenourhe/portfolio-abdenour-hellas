"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = () => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch("/api/testimonials", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setForm({});
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
    fetchTestimonials();
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
        <h1 className="text-3xl font-bold">Témoignages</h1>
        <button
          onClick={() => { setEditing(null); setForm({}); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {(editing || form.name !== undefined) && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl bg-card border border-border space-y-4">
          <h2 className="text-lg font-semibold">{editing ? "Modifier" : "Nouveau témoignage"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nom" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
            <input type="text" placeholder="Rôle" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
            <input type="text" placeholder="Entreprise" value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
            <input type="text" placeholder="Image URL (optionnel)" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
          </div>
          <textarea placeholder="Contenu" rows={3} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editing ? "Mettre à jour" : "Créer"}</button>
            <button type="button" onClick={() => { setEditing(null); setForm({}); }} className="px-4 py-2 border border-border rounded-lg hover:bg-muted">Annuler</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors">
            <div className="flex-1">
              <h3 className="font-medium">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.role} · {t.company}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.content}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(t); setForm(t); }} className="p-2 rounded-lg hover:bg-muted transition-colors"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
