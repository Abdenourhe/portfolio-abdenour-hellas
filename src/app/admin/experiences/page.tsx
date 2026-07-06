"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Experience } from "@/types";
import { Plus, Pencil, Trash2, GripVertical, Upload, ImageIcon } from "lucide-react";
import SpellCheck from "@/components/admin/SpellCheck";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<any>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = () => {
    fetch("/api/experiences")
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? "/api/experiences" : "/api/experiences";
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setForm({});
    setAdding(false);
    fetchExperiences();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette expérience ?")) return;
    await fetch(`/api/experiences?id=${id}`, { method: "DELETE" });
    fetchExperiences();
  };

  const handleEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "" as any,
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "" as any,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = experiences.findIndex((e) => e.id === active.id);
    const newIndex = experiences.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(experiences, oldIndex, newIndex);
    setExperiences(reordered);

    await fetch("/api/experiences/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: reordered.map((e, index) => ({ id: e.id, order: index })),
      }),
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
        <h1 className="text-3xl font-bold">Expériences</h1>
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
          <h2 className="text-lg font-semibold">{editing ? "Modifier" : "Nouvelle expérience"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Titre"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                required
              />
              <SpellCheck text={form.title || ""} onApply={(v) => setForm({ ...form, title: v })} />
            </div>
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Entreprise"
                value={form.company || ""}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                required
              />
              <SpellCheck text={form.company || ""} onApply={(v) => setForm({ ...form, company: v })} />
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
              placeholder="Date début"
              value={(form.startDate as any) || ""}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              required
            />
            <input
              type="date"
              placeholder="Date fin"
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
              Poste actuel
            </label>
            <input
              type="url"
              placeholder="Lien du certificat / attestation (URL)"
              value={form.url || ""}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <Upload size={16} />
                <span>{form.certificateImage ? "Changer l'image" : "Uploader image attestation"}</span>
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
                  <img src={form.certificateImage} alt="Aperçu attestation" className="w-full h-full object-cover" />
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
          <div className="space-y-1">
            <textarea
              placeholder="Description"
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
            <SpellCheck text={form.description || ""} onApply={(v) => setForm({ ...form, description: v })} />
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experiences.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {experiences.map((exp) => (
              <SortableExperienceItem
                key={exp.id}
                exp={exp}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </motion.div>
  );
}

function SortableExperienceItem({
  exp,
  onEdit,
  onDelete,
}: {
  exp: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-foreground cursor-move hover:text-foreground"
      >
        <GripVertical size={18} />
      </button>
      <div className="flex-1">
        <h3 className="font-medium">{exp.title}</h3>
        <p className="text-sm text-muted-foreground">
          {exp.company} · {exp.location}
          {exp.url ? " · " : ""}
          {exp.url && (
            <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Attestation ↗
            </a>
          )}
          {exp.certificateImage && (
            <span className="inline-flex items-center gap-1 ml-2 text-xs text-[#8B6914]">
              <ImageIcon size={12} /> Image
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(exp)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(exp.id)}
          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
