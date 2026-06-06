"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Trash2, GripVertical, ExternalLink, Award, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import SpellCheck from "@/components/admin/SpellCheck";

type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  order: number;
  createdAt: string;
};

export default function CertificationsAdminPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 5000);
  };

  const fetchCertifications = async () => {
    try {
      const res = await fetch("/api/certifications");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data || []);
    } catch {
      showNotice("error", "Impossible de charger les certifications");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (index: number, key: keyof Certification, value: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addItem = () => {
    const newItem: Certification = {
      id: `temp-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      url: "",
      order: items.length,
      createdAt: new Date().toISOString(),
    };
    setItems([...items, newItem]);
  };

  const removeItem = async (index: number) => {
    const item = items[index];
    if (!item) return;
    if (!item.id.startsWith("temp-")) {
      try {
        const res = await fetch(`/api/certifications?id=${item.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      } catch {
        showNotice("error", "Échec de la suppression");
        return;
      }
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(newIndex, 0, moved);
      return copy.map((item, i) => ({ ...item, order: i }));
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const allValid = items.every((item) => item.name.trim());
      if (!allValid) {
        showNotice("error", "Le nom de la certification est obligatoire");
        return;
      }

      for (const item of items) {
        const payload: Record<string, unknown> = {
          name: item.name,
          issuer: item.issuer,
          date: item.date,
          url: item.url,
          order: item.order,
        };
        if (!item.id.startsWith("temp-")) {
          payload.id = item.id;
        }
        const res = await fetch("/api/certifications", {
          method: item.id.startsWith("temp-") ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
      }
      await fetchCertifications();
      showNotice("success", "Certifications enregistrées");
    } catch {
      showNotice("error", "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6" />
          Certifications
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={addItem}
            className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Plus size={18} />
            Ajouter
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Enregistrer
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-lg border ${
            notice.type === "success"
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          }`}
        >
          {notice.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{notice.message}</span>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-base font-semibold">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                Certification #{index + 1}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="px-2 py-1 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="px-2 py-1 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium">Nom de la certification *</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  placeholder="ex: AWS Cloud Practitioner"
                  required
                />
                <SpellCheck text={item.name} onApply={(v) => updateItem(index, "name", v)} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Émetteur *</label>
                <input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => updateItem(index, "issuer", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  placeholder="ex: Amazon Web Services"
                  required
                />
                <SpellCheck text={item.issuer} onApply={(v) => updateItem(index, "issuer", v)} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => updateItem(index, "date", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  placeholder="ex: Mars 2025"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => updateItem(index, "url", e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                    placeholder="https://..."
                  />
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 text-muted-foreground border rounded-lg">
            Aucune certification. Cliquez sur &quot;Ajouter&quot; pour commencer.
          </div>
        )}
      </div>
    </motion.div>
  );
}
