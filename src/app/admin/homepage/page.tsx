"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import {
  Save,
  Eye,
  GripVertical,
  ArrowUpRight,
  Plus,
  X,
  BarChart3,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  MessageSquareQuote,
  FileText,
} from "lucide-react";

const SECTIONS = [
  { key: "stats", label: "Statistiques", icon: BarChart3 },
  { key: "experience", label: "Expériences", icon: Briefcase },
  { key: "education", label: "Formation", icon: GraduationCap },
  { key: "skills", label: "Compétences", icon: Wrench },
  { key: "projects", label: "Projets", icon: FolderOpen },
  { key: "testimonials", label: "Témoignages", icon: MessageSquareQuote },
  { key: "blog", label: "Blog", icon: FileText },
];

const DEFAULT_ORDER = SECTIONS.map((s) => s.key);

const DEFAULT_VISIBILITY: Record<string, boolean> = {
  stats: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  testimonials: true,
  blog: true,
};

const DEFAULT_VISIBLE_STATS = ["visit", "cv_download"];

const STAT_TYPES = [
  { key: "years_exp", label: "Années d'expérience" },
  { key: "projects", label: "Projets" },
  { key: "education", label: "Formations" },
  { key: "skills", label: "Compétences" },
  { key: "visit", label: "Visites" },
  { key: "cv_download", label: "Téléchargements CV" },
];

interface HomepageSettings {
  id?: string;
  heroTitle?: string;
  heroTitleEn?: string;
  heroTitleAr?: string;
  heroSubtitle?: string;
  heroSubtitleEn?: string;
  heroSubtitleAr?: string;
  typewriterPhrasesFr?: string[];
  typewriterPhrasesEn?: string[];
  typewriterPhrasesAr?: string[];
  sectionsOrder?: string[];
  sectionsVisibility?: Record<string, boolean>;
  featuredProjectIds?: string[];
  visibleStatsTypes?: string[];
}

function SortableSectionItem({
  sectionKey,
  label,
  icon: Icon,
  visible,
  onToggle,
}: {
  sectionKey: string;
  label: string;
  icon: React.ElementType;
  visible: boolean;
  onToggle: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sectionKey });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>
      <Icon size={18} className="text-primary" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={visible}
          onChange={() => onToggle(sectionKey)}
          className="rounded border-border text-primary focus:ring-primary"
        />
        {visible ? "Visible" : "Masqué"}
      </label>
    </div>
  );
}

function PhraseList({
  phrases,
  onChange,
  placeholder,
}: {
  phrases: string[];
  onChange: (phrases: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  const add = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onChange([...phrases, trimmed]);
    setValue("");
  };

  const remove = (index: number) => {
    onChange(phrases.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {phrases.map((phrase, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
          >
            {phrase}
            <button type="button" onClick={() => remove(i)} className="hover:text-destructive">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomepageSettingsPage() {
  const [settings, setSettings] = useState<HomepageSettings>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"fr" | "en" | "ar">("fr");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    Promise.all([fetch("/api/homepage-settings").then((r) => r.json()), fetch("/api/projects").then((r) => r.json())])
      .then(([settingsData, projectsData]) => {
        setSettings({
          ...settingsData,
          sectionsOrder: settingsData.sectionsOrder?.length ? settingsData.sectionsOrder : DEFAULT_ORDER,
          sectionsVisibility: settingsData.sectionsVisibility || DEFAULT_VISIBILITY,
          visibleStatsTypes: settingsData.visibleStatsTypes?.length ? settingsData.visibleStatsTypes : DEFAULT_VISIBLE_STATS,
          featuredProjectIds: settingsData.featuredProjectIds || [],
          typewriterPhrasesFr: settingsData.typewriterPhrasesFr || [],
          typewriterPhrasesEn: settingsData.typewriterPhrasesEn || [],
          typewriterPhrasesAr: settingsData.typewriterPhrasesAr || [],
        });
        setProjects(projectsData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = settings.sectionsOrder!.indexOf(active.id as string);
      const newIndex = settings.sectionsOrder!.indexOf(over.id as string);
      setSettings({
        ...settings,
        sectionsOrder: arrayMove(settings.sectionsOrder!, oldIndex, newIndex),
      });
    }
  };

  const toggleVisibility = (key: string) => {
    setSettings({
      ...settings,
      sectionsVisibility: {
        ...settings.sectionsVisibility,
        [key]: !settings.sectionsVisibility?.[key],
      },
    });
  };

  const toggleFeaturedProject = (projectId: string) => {
    const current = settings.featuredProjectIds || [];
    if (current.includes(projectId)) {
      setSettings({ ...settings, featuredProjectIds: current.filter((id) => id !== projectId) });
    } else {
      setSettings({ ...settings, featuredProjectIds: [...current, projectId] });
    }
  };

  const toggleVisibleStat = (statType: string) => {
    const current = settings.visibleStatsTypes || [];
    if (current.includes(statType)) {
      setSettings({ ...settings, visibleStatsTypes: current.filter((t) => t !== statType) });
    } else {
      setSettings({ ...settings, visibleStatsTypes: [...current, statType] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/homepage-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setMessage("Paramètres de l'accueil mis à jour avec succès");
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage("Erreur : " + (err.error || "Mise à jour échouée"));
    }
    setSaving(false);
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
        <h1 className="text-3xl font-bold">Gestion de l'accueil</h1>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm"
        >
          <Eye size={16} />
          Aperçu
          <ArrowUpRight size={14} />
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Hero */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Hero</h2>

          <div className="flex gap-2 border-b border-border">
            {(["fr", "en", "ar"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveTab(lang)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === lang
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre du Hero</label>
              <input
                type="text"
                value={(settings[`heroTitle${activeTab === "fr" ? "" : activeTab === "en" ? "En" : "Ar"}` as keyof HomepageSettings] as string) || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [`heroTitle${activeTab === "fr" ? "" : activeTab === "en" ? "En" : "Ar"}`]:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sous-titre du Hero</label>
              <input
                type="text"
                value={(settings[`heroSubtitle${activeTab === "fr" ? "" : activeTab === "en" ? "En" : "Ar"}` as keyof HomepageSettings] as string) || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [`heroSubtitle${activeTab === "fr" ? "" : activeTab === "en" ? "En" : "Ar"}`]:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phrases du TypeWriter ({activeTab.toUpperCase()})
            </label>
            <PhraseList
              phrases={(settings[`typewriterPhrases${activeTab === "fr" ? "Fr" : activeTab === "en" ? "En" : "Ar"}` as keyof HomepageSettings] as string[]) || []}
              onChange={(phrases) =>
                setSettings({
                  ...settings,
                  [`typewriterPhrases${activeTab === "fr" ? "Fr" : activeTab === "en" ? "En" : "Ar"}`]: phrases,
                })
              }
              placeholder={`Ajouter une phrase en ${activeTab.toUpperCase()}...`}
            />
          </div>
        </section>

        {/* Sections order & visibility */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Ordre et visibilité des sections</h2>
          <p className="text-sm text-muted-foreground">Glissez-déposez pour réordonner. Cochez/décochez pour afficher ou masquer.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={settings.sectionsOrder || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {settings.sectionsOrder?.map((key) => {
                  const section = SECTIONS.find((s) => s.key === key)!;
                  return (
                    <SortableSectionItem
                      key={key}
                      sectionKey={key}
                      label={section.label}
                      icon={section.icon}
                      visible={!!settings.sectionsVisibility?.[key]}
                      onToggle={toggleVisibility}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        {/* Featured projects */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Projets mis en avant</h2>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun projet trouvé. Créez-en dans Projets.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((project) => (
                <label
                  key={project.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(settings.featuredProjectIds || []).includes(project.id)}
                    onChange={() => toggleFeaturedProject(project.id)}
                    className="mt-1 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-sm font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* Visible stats */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Statistiques affichées</h2>
          <div className="flex flex-wrap gap-3">
            {STAT_TYPES.map((stat) => (
              <label
                key={stat.key}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(settings.visibleStatsTypes || []).includes(stat.key)}
                  onChange={() => toggleVisibleStat(stat.key)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">{stat.label}</span>
              </label>
            ))}
          </div>
        </section>

        {message && (
          <p className={`text-sm ${message.includes("succès") ? "text-secondary" : "text-destructive"}`}>{message}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
        </button>
      </form>
    </motion.div>
  );
}
