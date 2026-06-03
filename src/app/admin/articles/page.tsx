"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch("/api/articles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setForm({});
    setAdding(false);
    fetchArticles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
    fetchArticles();
  };

  const togglePublished = async (article: any) => {
    await fetch("/api/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: article.id, published: !article.published }),
    });
    fetchArticles();
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
        <h1 className="text-3xl font-bold">Articles</h1>
        <button
          onClick={() => { setEditing(null); setForm({ published: true }); setAdding(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {(editing || adding) && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl bg-card border border-border space-y-4">
          <h2 className="text-lg font-semibold">{editing ? "Modifier" : "Nouvel article"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Titre" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
            <input type="text" placeholder="Slug (unique)" value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
            <input type="text" placeholder="Image URL (optionnel)" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" />
            <label className="flex items-center gap-2 px-4 py-2">
              <input type="checkbox" checked={form.published || false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
              Publié
            </label>
          </div>
          <input type="text" placeholder="Extrait" value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
          <textarea placeholder="Contenu" rows={6} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none" required />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editing ? "Mettre à jour" : "Créer"}</button>
            <button type="button" onClick={() => { setEditing(null); setForm({}); setAdding(false); }} className="px-4 py-2 border border-border rounded-lg hover:bg-muted">Annuler</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {articles.map((a) => (
          <div key={a.id} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{a.title}</h3>
                {a.published ? (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-500">Publié</span>
                ) : (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">Brouillon</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">/{a.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/fr/blog/${a.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Voir l'article"
              >
                <Eye size={16} />
              </a>
              <button
                onClick={() => togglePublished(a)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${a.published ? "bg-green-500" : "bg-muted"}`}
                title={a.published ? "Dépublier" : "Publier"}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${a.published ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <button onClick={() => { setEditing(a); setForm(a); }} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Modifier"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Supprimer"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
