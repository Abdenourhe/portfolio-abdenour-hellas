"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Loader2,
  FileText,
  Monitor,
  Printer,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  History,
  Settings2,
  ShieldCheck,
  AlertCircle,
  Save,
  Pencil,
  RotateCcw,
  GripVertical,
  ChevronDown,
  Layers,
  ListChecks,
  X,
  Plus,
} from "lucide-react";
import CVPrintTemplate from "@/components/public/CVPrintTemplate";
import {
  CvPrintConfig,
  CvPrintSectionConfig,
  CvPrintItemOverride,
  Experience,
  Education,
  Skill,
  Project,
} from "@/types";
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

interface CvPrintFormData {
  cvPrintFullName: string;
  cvPrintTitle: string;
  cvPrintTitleEn: string;
  cvPrintEmail: string;
  cvPrintPhone: string;
  cvPrintLocation: string;
  cvPrintLinkedin: string;
  cvPrintWebsite: string;
  cvPrintBio: string;
  cvPrintBioEn: string;
}

interface HomepageData {
  profile: Record<string, unknown> & { cvPrintConfig?: CvPrintConfig | null };
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Education[];
}

async function getHtml2Pdf() {
  const mod = await import("html2pdf.js");
  return mod.default || mod;
}

type ViewMode = "screen" | "print";

interface CvStatus {
  status: "synchronized" | "desynchronized";
  reason: string | null;
  templateHash: string | null;
  htmlHash: string | null;
  hashesMatch: boolean;
  pdfOutdated: boolean;
  templateMtime: string | null;
  htmlMtime: string | null;
  pdfMtime: string | null;
  cvLastSyncedAt: string | null;
  lastCvGeneratedAt: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  cvGenerationMode: "HEADLESS" | "HTML2PDF";
}

interface CvLog {
  id: string;
  generatedAt: string;
  method: "HEADLESS" | "HTML2PDF";
  fileSizeKb: number | null;
  success: boolean;
  error: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CV_SECTION_ORDER: CvPrintSectionConfig["key"][] = [
  "header",
  "profile",
  "experience",
  "skills",
  "languages",
  "education",
  "projects",
  "certifications",
];

const DEFAULT_SECTION_LABELS: Record<CvPrintSectionConfig["key"], string> = {
  header: "",
  profile: "Profil",
  experience: "Expériences professionnelles",
  skills: "Compétences",
  languages: "Langues",
  education: "Formation",
  projects: "Projets",
  certifications: "Certifications",
};

const DEFAULT_SECTION_LABELS_EN: Record<CvPrintSectionConfig["key"], string> = {
  header: "",
  profile: "Profile",
  experience: "Professional Experience",
  skills: "Skills",
  languages: "Languages",
  education: "Education",
  projects: "Projects",
  certifications: "Certifications",
};

function getDefaultSectionLabel(key: CvPrintSectionConfig["key"], locale: "fr" | "en"): string {
  return locale === "en" ? DEFAULT_SECTION_LABELS_EN[key] : DEFAULT_SECTION_LABELS[key];
}

const SECTION_UI_LABELS: Record<CvPrintSectionConfig["key"], string> = {
  header: "En-tête",
  profile: "Profil",
  experience: "Expériences",
  skills: "Compétences",
  languages: "Langues",
  education: "Formation",
  projects: "Projets",
  certifications: "Certifications",
};

const SECTION_UI_LABELS_EN: Record<CvPrintSectionConfig["key"], string> = {
  header: "Header",
  profile: "Profile",
  experience: "Experience",
  skills: "Skills",
  languages: "Languages",
  education: "Education",
  projects: "Projects",
  certifications: "Certifications",
};

function getSectionUiLabel(key: CvPrintSectionConfig["key"], locale: "fr" | "en"): string {
  return locale === "en" ? SECTION_UI_LABELS_EN[key] : SECTION_UI_LABELS[key];
}

const SELECTABLE_SECTIONS: CvPrintSectionConfig["key"][] = [
  "experience",
  "education",
  "skills",
  "languages",
  "projects",
  "certifications",
];

function getDefaultCvPrintConfig(
  experiences: Experience[],
  education: Education[],
  skills: Skill[],
  projects: Project[],
  certifications: Education[]
): CvPrintConfig {
  return {
    sections: CV_SECTION_ORDER.map((key) => {
      const base: CvPrintSectionConfig = {
        key,
        visible: true,
        label: DEFAULT_SECTION_LABELS[key],
      };
      if (key === "experience") base.itemIds = experiences.map((e) => e.id);
      if (key === "education") base.itemIds = education.map((e) => e.id);
      if (key === "skills") base.itemIds = skills.filter((s) => s.category !== "langue").map((s) => s.id);
      if (key === "languages") base.itemIds = skills.filter((s) => s.category === "langue").map((s) => s.id);
      if (key === "projects") base.itemIds = projects.map((p) => p.id);
      if (key === "certifications") base.itemIds = certifications.map((c) => c.id);
      return base;
    }),
    itemOverrides: {},
  };
}

function parseCvPrintConfig(
  saved: CvPrintConfig | null | undefined,
  experiences: Experience[],
  education: Education[],
  skills: Skill[],
  projects: Project[],
  certifications: Education[]
): CvPrintConfig {
  const defaults = getDefaultCvPrintConfig(experiences, education, skills, projects, certifications);
  if (!saved) return defaults;
  const savedMap = new Map(saved.sections.map((s) => [s.key, s]));
  return {
    sections: defaults.sections.map((def) => {
      const s = savedMap.get(def.key);
      return {
        ...def,
        ...s,
        label: s?.label ?? def.label,
        itemIds: s?.itemIds ?? def.itemIds,
      };
    }),
    itemOverrides: saved.itemOverrides || {},
  };
}

function cleanItemOverride(override: CvPrintItemOverride): CvPrintItemOverride | null {
  const cleaned: CvPrintItemOverride = {};
  const stringFields: Array<"title" | "subtitle" | "description" | "dateRange" | "titleEn" | "subtitleEn" | "descriptionEn" | "dateRangeEn"> = [
    "title",
    "subtitle",
    "description",
    "dateRange",
    "titleEn",
    "subtitleEn",
    "descriptionEn",
    "dateRangeEn",
  ];
  stringFields.forEach((field) => {
    const value = override[field];
    if (typeof value === "string" && value.trim()) {
      cleaned[field] = value.trim();
    } else if (value !== undefined) {
      cleaned[field] = null;
    }
  });

  (["technologies", "technologiesEn"] as const).forEach((field) => {
    const value = override[field];
    if (Array.isArray(value) && value.length > 0) {
      cleaned[field] = value.map((t) => t.trim()).filter(Boolean);
    } else if (value !== undefined) {
      cleaned[field] = null;
    }
  });

  const hasValue = Object.values(cleaned).some(
    (v) => v !== null && v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  );
  return hasValue ? cleaned : null;
}

function cleanConfigForSave(config: CvPrintConfig): CvPrintConfig {
  const cleanedOverrides: Record<string, CvPrintItemOverride> = {};
  Object.entries(config.itemOverrides).forEach(([key, override]) => {
    const cleaned = cleanItemOverride(override);
    if (cleaned) cleanedOverrides[key] = cleaned;
  });
  const cleanedSections = config.sections.map((section) => ({
    ...section,
    label: section.label?.trim() || null,
    itemIds: section.itemIds?.length ? section.itemIds : null,
  }));
  return { sections: cleanedSections, itemOverrides: cleanedOverrides };
}

function getItemType(sectionKey: CvPrintSectionConfig["key"]): string {
  switch (sectionKey) {
    case "experience":
      return "experience";
    case "education":
      return "education";
    case "skills":
    case "languages":
      return "skill";
    case "projects":
      return "project";
    case "certifications":
      return "certification";
    default:
      return sectionKey;
  }
}

function getSectionItems(
  sectionKey: CvPrintSectionConfig["key"],
  data: HomepageData
): Array<{ id: string; title: string }> {
  switch (sectionKey) {
    case "experience":
      return (data.experiences || []).map((e: Experience) => ({ id: e.id, title: e.title }));
    case "education":
      return (data.education || []).map((e: Education) => ({ id: e.id, title: e.degree }));
    case "skills":
      return (data.skills || [])
        .filter((s: Skill) => s.category !== "langue")
        .map((s: Skill) => ({ id: s.id, title: s.name }));
    case "languages":
      return (data.skills || [])
        .filter((s: Skill) => s.category === "langue")
        .map((s: Skill) => ({ id: s.id, title: s.name }));
    case "projects":
      return (data.projects || []).map((p: Project) => ({ id: p.id, title: p.title }));
    case "certifications":
      return (data.certifications || []).map((c: Education) => ({ id: c.id, title: c.degree }));
    default:
      return [];
  }
}

function getItemOriginalValues(
  sectionKey: CvPrintSectionConfig["key"],
  itemId: string,
  data: HomepageData
): CvPrintItemOverride {
  switch (sectionKey) {
    case "experience": {
      const exp = data.experiences?.find((e) => e.id === itemId);
      if (!exp) return {};
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : null;
      const monthLabels = ["jan", "fév", "mars", "avr", "mai", "juin", "juill", "août", "sept", "oct", "nov", "déc"];
      const format = (d: Date) => `${monthLabels[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
      const dateRange = exp.current
        ? `${format(start)} — Présent`
        : end
        ? `${format(start)} — ${format(end)}`
        : format(start);
      return {
        title: exp.title,
        subtitle: `${exp.company} — ${exp.location}`,
        description: exp.description,
        dateRange,
      };
    }
    case "education": {
      const edu = data.education?.find((e) => e.id === itemId);
      if (!edu) return {};
      const start = new Date(edu.startDate);
      const end = edu.endDate ? new Date(edu.endDate) : null;
      const dateRange = edu.current
        ? `${start.getUTCFullYear()} — Présent`
        : end
        ? `${start.getUTCFullYear()} — ${end.getUTCFullYear()}`
        : `${start.getUTCFullYear()}`;
      return {
        title: edu.degree,
        subtitle: `${edu.school}, ${edu.location}`,
        dateRange,
      };
    }
    case "skills":
    case "languages": {
      const skill = data.skills?.find((s) => s.id === itemId);
      return skill ? { title: skill.name } : {};
    }
    case "projects": {
      const project = data.projects?.find((p) => p.id === itemId);
      return project
        ? {
            title: project.title,
            description: project.description,
            technologies: [...(project.technologies || [])],
          }
        : {};
    }
    case "certifications": {
      const cert = data.certifications?.find((c) => c.id === itemId);
      if (!cert) return {};
      const start = new Date(cert.startDate);
      const end = cert.endDate ? new Date(cert.endDate) : null;
      const monthLabels = ["jan", "fév", "mars", "avr", "mai", "juin", "juill", "août", "sept", "oct", "nov", "déc"];
      const format = (d: Date) => `${monthLabels[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
      const dateRange = cert.current
        ? `${format(start)} — Présent`
        : end
        ? `${format(start)} — ${format(end)}`
        : format(start);
      return {
        title: cert.degree,
        subtitle: `${cert.school}, ${cert.location}`,
        dateRange,
      };
    }
    default:
      return {};
  }
}

function getOverrideFields(
  sectionKey: CvPrintSectionConfig["key"],
  locale: "fr" | "en" = "fr"
): Array<keyof CvPrintItemOverride> {
  const baseFields = (() => {
    switch (sectionKey) {
      case "experience":
        return ["title", "subtitle", "description", "dateRange"];
      case "education":
        return ["title", "subtitle", "dateRange"];
      case "skills":
      case "languages":
        return ["title"];
      case "projects":
        return ["title", "description", "technologies"];
      case "certifications":
        return ["title", "subtitle", "dateRange"];
      default:
        return [];
    }
  })() as Array<"title" | "subtitle" | "description" | "dateRange" | "technologies">;

  if (locale === "en") {
    return baseFields.map((f) =>
      f === "technologies" ? "technologiesEn" : (`${f}En` as keyof CvPrintItemOverride)
    );
  }
  return baseFields;
}

function toEnglishDateRange(dateRange: string): string {
  return dateRange
    .replace(/Présent/g, "Present")
    .replace(/jan/g, "Jan")
    .replace(/fév/g, "Feb")
    .replace(/mars/g, "Mar")
    .replace(/avr/g, "Apr")
    .replace(/mai/g, "May")
    .replace(/juin/g, "Jun")
    .replace(/juill/g, "Jul")
    .replace(/août/g, "Aug")
    .replace(/sept/g, "Sep")
    .replace(/oct/g, "Oct")
    .replace(/nov/g, "Nov")
    .replace(/déc/g, "Dec");
}

function getItemOriginalValuesForLocale(
  sectionKey: CvPrintSectionConfig["key"],
  itemId: string,
  data: HomepageData,
  locale: "fr" | "en"
): CvPrintItemOverride {
  const french = getItemOriginalValues(sectionKey, itemId, data);
  if (locale === "fr") return french;

  const english: CvPrintItemOverride = {};
  if (french.title !== undefined) {
    switch (sectionKey) {
      case "experience": {
        const exp = data.experiences?.find((e) => e.id === itemId);
        english.titleEn = exp?.titleEn || french.title;
        english.subtitleEn = french.subtitle;
        english.descriptionEn = exp?.descriptionEn || french.description;
        english.dateRangeEn = french.dateRange ? toEnglishDateRange(french.dateRange) : french.dateRange;
        break;
      }
      case "education": {
        const edu = data.education?.find((e) => e.id === itemId);
        english.titleEn = edu?.degreeEn || french.title;
        english.subtitleEn = french.subtitle;
        english.dateRangeEn = french.dateRange ? toEnglishDateRange(french.dateRange) : french.dateRange;
        break;
      }
      case "skills":
      case "languages": {
        const skill = data.skills?.find((s) => s.id === itemId);
        english.titleEn = skill?.nameEn || french.title;
        break;
      }
      case "projects": {
        const project = data.projects?.find((p) => p.id === itemId);
        english.titleEn = project?.titleEn || french.title;
        english.descriptionEn = project?.descriptionEn || french.description;
        english.technologiesEn = french.technologies;
        break;
      }
      case "certifications": {
        const cert = data.certifications?.find((c) => c.id === itemId);
        english.titleEn = cert?.degreeEn || french.title;
        english.subtitleEn = french.subtitle;
        english.dateRangeEn = french.dateRange ? toEnglishDateRange(french.dateRange) : french.dateRange;
        break;
      }
      default:
        break;
    }
  }
  return english;
}

function getSectionLabelForInput(
  label: string | null | undefined,
  locale: "fr" | "en"
): string {
  if (label?.startsWith("EN:")) {
    return locale === "en" ? label.slice(3) : "";
  }
  return label || "";
}

function SortableCvSectionItem({
  section,
  locale,
  onToggle,
  onLabelChange,
}: {
  section: CvPrintSectionConfig;
  locale: "fr" | "en";
  onToggle: (key: CvPrintSectionConfig["key"]) => void;
  onLabelChange: (key: CvPrintSectionConfig["key"], label: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.key,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>
      <input
        type="checkbox"
        checked={section.visible}
        onChange={() => onToggle(section.key)}
        className="rounded border-border text-primary focus:ring-primary"
      />
      <input
        type="text"
        value={getSectionLabelForInput(section.label, locale)}
        onChange={(e) => onLabelChange(section.key, e.target.value)}
        placeholder={getDefaultSectionLabel(section.key, locale)}
        className="flex-1 min-w-0 px-2 py-1.5 rounded-md bg-background border border-border focus:border-primary focus:outline-none text-sm"
      />
    </div>
  );
}

function SortableSectionContentItem({
  id,
  title,
  selected,
  overridden,
  onToggle,
  onEdit,
}: {
  id: string;
  title: string;
  selected: boolean;
  overridden: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(id)}
        className="rounded border-border text-primary focus:ring-primary"
      />
      <span className="flex-1 text-sm truncate">{title}</span>
      {overridden && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium shrink-0">
          Modifié
        </span>
      )}
      <button
        type="button"
        onClick={() => onEdit(id)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted transition-colors"
      >
        <Pencil size={12} />
        Éditer
      </button>
    </div>
  );
}

function OverrideEditor({
  sectionKey,
  itemTitle,
  locale,
  draft,
  onChange,
  onSave,
  onCancel,
  onRemove,
}: {
  sectionKey: CvPrintSectionConfig["key"];
  itemTitle: string;
  locale: "fr" | "en";
  draft: CvPrintItemOverride;
  onChange: (draft: CvPrintItemOverride) => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const fields = getOverrideFields(sectionKey, locale);
  const isEn = locale === "en";

  const updateField = <K extends keyof CvPrintItemOverride>(key: K, value: CvPrintItemOverride[K]) => {
    onChange({ ...draft, [key]: value });
  };

  const titleField: keyof CvPrintItemOverride = isEn ? "titleEn" : "title";
  const subtitleField: keyof CvPrintItemOverride = isEn ? "subtitleEn" : "subtitle";
  const descriptionField: keyof CvPrintItemOverride = isEn ? "descriptionEn" : "description";
  const dateRangeField: keyof CvPrintItemOverride = isEn ? "dateRangeEn" : "dateRange";
  const technologiesField: keyof CvPrintItemOverride = isEn ? "technologiesEn" : "technologies";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-card border border-border rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            {isEn ? "Edit" : "Modifier"} « {itemTitle} »
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {fields.includes(titleField) && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isEn ? "Title" : "Titre"}
              </label>
              <input
                type="text"
                value={(draft[titleField] as string) || ""}
                onChange={(e) => updateField(titleField, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
              />
            </div>
          )}
          {fields.includes(subtitleField) && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isEn ? "Subtitle" : "Sous-titre"}
              </label>
              <input
                type="text"
                value={(draft[subtitleField] as string) || ""}
                onChange={(e) => updateField(subtitleField, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
              />
            </div>
          )}
          {fields.includes(descriptionField) && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isEn ? "Description" : "Description"}
              </label>
              <textarea
                value={(draft[descriptionField] as string) || ""}
                onChange={(e) => updateField(descriptionField, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm resize-none"
              />
            </div>
          )}
          {fields.includes(dateRangeField) && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isEn ? "Period" : "Période"}
              </label>
              <input
                type="text"
                value={(draft[dateRangeField] as string) || ""}
                onChange={(e) => updateField(dateRangeField, e.target.value)}
                placeholder={isEn ? "e.g. Jan. 2020 — Present" : "ex: Janv. 2020 — Présent"}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
              />
            </div>
          )}
          {fields.includes(technologiesField) && (
            <TechnologyEditor
              technologies={(draft[technologiesField] as string[]) || []}
              onChange={(technologies) => updateField(technologiesField, technologies)}
              addLabel={isEn ? "Add" : "Ajouter"}
              placeholder={isEn ? "Add a technology..." : "Ajouter une technologie..."}
            />
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onSave}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Save size={16} />
            {isEn ? "Save" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-destructive text-destructive bg-destructive/5 rounded-lg text-sm font-medium hover:bg-destructive/10 transition-colors"
          >
            {isEn ? "Reset" : "Réinitialiser"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border bg-background text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            {isEn ? "Cancel" : "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TechnologyEditor({
  technologies,
  onChange,
  addLabel = "Ajouter",
  placeholder = "Ajouter une technologie...",
}: {
  technologies: string[];
  onChange: (technologies: string[]) => void;
  addLabel?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  const add = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onChange([...technologies, trimmed]);
    setValue("");
  };

  const remove = (index: number) => {
    onChange(technologies.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">Technologies</label>
      <div className="flex gap-2 mb-2">
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
          <Plus size={14} /> {addLabel}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
          >
            {tech}
            <button type="button" onClick={() => remove(i)} className="hover:text-destructive">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminCVPrintPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ViewMode>("print");
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [status, setStatus] = useState<CvStatus | null>(null);
  const [logs, setLogs] = useState<CvLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [cvForm, setCvForm] = useState<CvPrintFormData>({
    cvPrintFullName: "",
    cvPrintTitle: "",
    cvPrintTitleEn: "",
    cvPrintEmail: "",
    cvPrintPhone: "",
    cvPrintLocation: "",
    cvPrintLinkedin: "",
    cvPrintWebsite: "",
    cvPrintBio: "",
    cvPrintBioEn: "",
  });
  const [activeLocale, setActiveLocale] = useState<"fr" | "en">("fr");
  const [cvConfig, setCvConfig] = useState<CvPrintConfig>(() =>
    getDefaultCvPrintConfig([], [], [], [], [])
  );
  const [formChanged, setFormChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<
    Partial<Record<CvPrintSectionConfig["key"], boolean>>
  >({});
  const [editingOverride, setEditingOverride] = useState<{
    sectionKey: CvPrintSectionConfig["key"];
    itemId: string;
  } | null>(null);
  const [overrideDraft, setOverrideDraft] = useState<CvPrintItemOverride>({});
  const cvRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchStatus = async (locale: "fr" | "en" = activeLocale) => {
    try {
      const res = await fetch(`/api/cv/status?locale=${locale}`);
      if (res.ok) setStatus(await res.json());
    } catch (error) {
      console.error("Failed to fetch CV status:", error);
    }
  };

  const fetchLogs = async (locale: "fr" | "en" = activeLocale) => {
    setLogsLoading(true);
    try {
      const res = await fetch(`/api/cv/logs?locale=${locale}`);
      if (res.ok) setLogs(await res.json());
    } catch (error) {
      console.error("Failed to fetch CV logs:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        const p = result.profile || {};
        setCvForm({
          cvPrintFullName: p.cvPrintFullName || "",
          cvPrintTitle: p.cvPrintTitle || "",
          cvPrintTitleEn: p.cvPrintTitleEn || "",
          cvPrintEmail: p.cvPrintEmail || "",
          cvPrintPhone: p.cvPrintPhone || "",
          cvPrintLocation: p.cvPrintLocation || "",
          cvPrintLinkedin: p.cvPrintLinkedin || "",
          cvPrintWebsite: p.cvPrintWebsite || "",
          cvPrintBio: p.cvPrintBio || "",
          cvPrintBioEn: p.cvPrintBioEn || "",
        });
        setCvConfig(
          parseCvPrintConfig(
            p.cvPrintConfig,
            result.experiences || [],
            result.education || [],
            result.skills || [],
            result.projects || [],
            result.certifications || []
          )
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetchStatus();
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchStatus(activeLocale);
    fetchLogs(activeLocale);
  }, [activeLocale]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const updateFormField = (field: keyof CvPrintFormData, value: string) => {
    setCvForm((prev) => ({ ...prev, [field]: value }));
    setFormChanged(true);
  };

  const resetForm = () => {
    if (!data?.profile) return;
    const p = data.profile;
    setCvForm({
      cvPrintFullName: p.cvPrintFullName || "",
      cvPrintTitle: p.cvPrintTitle || "",
      cvPrintTitleEn: p.cvPrintTitleEn || "",
      cvPrintEmail: p.cvPrintEmail || "",
      cvPrintPhone: p.cvPrintPhone || "",
      cvPrintLocation: p.cvPrintLocation || "",
      cvPrintLinkedin: p.cvPrintLinkedin || "",
      cvPrintWebsite: p.cvPrintWebsite || "",
      cvPrintBio: p.cvPrintBio || "",
      cvPrintBioEn: p.cvPrintBioEn || "",
    });
    setCvConfig(
      parseCvPrintConfig(
        p.cvPrintConfig,
        data.experiences || [],
        data.education || [],
        data.skills || [],
        data.projects || [],
        data.certifications || []
      )
    );
    setFormChanged(false);
  };

  const resetCvConfig = () => {
    if (!data) return;
    setCvConfig(
      getDefaultCvPrintConfig(
        data.experiences || [],
        data.education || [],
        data.skills || [],
        data.projects || [],
        data.certifications || []
      )
    );
    setFormChanged(true);
  };

  const handleSaveCvContent = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cvForm,
          // Convert empty strings to null so the template falls back to public profile fields
          cvPrintFullName: cvForm.cvPrintFullName.trim() || null,
          cvPrintTitle: cvForm.cvPrintTitle.trim() || null,
          cvPrintTitleEn: cvForm.cvPrintTitleEn.trim() || null,
          cvPrintEmail: cvForm.cvPrintEmail.trim() || null,
          cvPrintPhone: cvForm.cvPrintPhone.trim() || null,
          cvPrintLocation: cvForm.cvPrintLocation.trim() || null,
          cvPrintLinkedin: cvForm.cvPrintLinkedin.trim() || null,
          cvPrintWebsite: cvForm.cvPrintWebsite.trim() || null,
          cvPrintBio: cvForm.cvPrintBio.trim() || null,
          cvPrintBioEn: cvForm.cvPrintBioEn.trim() || null,
          cvPrintConfig: cleanConfigForSave(cvConfig),
        }),
      });
      if (res.ok) {
        showMessage("Contenu du CV enregistré avec succès.", "success");
        setFormChanged(false);
        // Refresh data so the preview uses the new values
        const refreshed = await fetch("/api/homepage").then((r) => r.json());
        setData(refreshed);
      } else {
        const err = await res.json().catch(() => ({}));
        showMessage("Erreur : " + (err.error || "Échec de l'enregistrement"), "error");
      }
    } catch (error) {
      showMessage("Erreur réseau lors de l'enregistrement.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadHtml2Pdf = async () => {
    if (!cvRef.current) return;
    setGenerating(true);

    const html2pdf = await getHtml2Pdf();
    const element = cvRef.current;
    const opt = {
      margin: 0,
      filename: "Abdenour_Hellas_CV.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
      showMessage("PDF téléchargé avec succès (html2pdf.js)", "success");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      showMessage("Erreur lors du téléchargement du PDF.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateHeadless = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "HEADLESS", locale: activeLocale }),
      });
      const result = await res.json();
      if (res.ok) {
        showMessage(`PDF régénéré avec succès (${result.fileSizeKb} Ko)`, "success");
        fetchStatus(activeLocale);
        fetchLogs(activeLocale);
      } else {
        showMessage("Erreur : " + (result.error || "Échec de la régénération"), "error");
      }
    } catch (error) {
      showMessage("Erreur réseau lors de la régénération.", "error");
    } finally {
      setRegenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleModeChange = async (newMode: "HEADLESS" | "HTML2PDF") => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvGenerationMode: newMode }),
      });
      if (res.ok) {
        setStatus((prev) => (prev ? { ...prev, cvGenerationMode: newMode } : null));
        showMessage(
          `Mode de génération par défaut : ${newMode === "HEADLESS" ? "Headless" : "html2pdf.js"}`,
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to update generation mode:", error);
      showMessage("Erreur lors de la mise à jour du mode.", "error");
    }
  };

  // CvPrintConfig helpers
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCvConfig((prev) => {
      const oldIndex = prev.sections.findIndex((s) => s.key === active.id);
      const newIndex = prev.sections.findIndex((s) => s.key === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
    });
    setFormChanged(true);
  };

  const toggleSectionVisibility = (key: CvPrintSectionConfig["key"]) => {
    setCvConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)),
    }));
    setFormChanged(true);
  };

  const updateSectionLabel = (key: CvPrintSectionConfig["key"], label: string) => {
    setCvConfig((prev) => {
      const current = prev.sections.find((s) => s.key === key);
      const rawLabel = label.trim();
      let storedLabel: string | null;
      if (activeLocale === "en") {
        storedLabel = rawLabel ? `EN:${rawLabel}` : null;
      } else {
        // French mode: preserve an existing English label if the input is left empty
        const existingEnglishLabel = current?.label?.startsWith("EN:") ? current.label : null;
        storedLabel = rawLabel || existingEnglishLabel || null;
      }
      return {
        ...prev,
        sections: prev.sections.map((s) => (s.key === key ? { ...s, label: storedLabel } : s)),
      };
    });
    setFormChanged(true);
  };

  const getSectionItemIds = (sectionKey: CvPrintSectionConfig["key"]) => {
    return cvConfig.sections.find((s) => s.key === sectionKey)?.itemIds || [];
  };

  const toggleItemSelection = (sectionKey: CvPrintSectionConfig["key"], itemId: string) => {
    setCvConfig((prev) => {
      const section = prev.sections.find((s) => s.key === sectionKey);
      if (!section) return prev;
      const currentIds = section.itemIds || [];
      const isSelected = currentIds.includes(itemId);
      const newIds = isSelected
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId];
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.key === sectionKey ? { ...s, itemIds: newIds } : s
        ),
      };
    });
    setFormChanged(true);
  };

  const handleItemDragEnd = (sectionKey: CvPrintSectionConfig["key"], event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCvConfig((prev) => {
      const section = prev.sections.find((s) => s.key === sectionKey);
      if (!section) return prev;
      const ids = section.itemIds || [];
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.key === sectionKey ? { ...s, itemIds: arrayMove(ids, oldIndex, newIndex) } : s
        ),
      };
    });
    setFormChanged(true);
  };

  const getOverrideKey = (sectionKey: CvPrintSectionConfig["key"], itemId: string) => {
    return `${getItemType(sectionKey)}:${itemId}`;
  };

  const isOverridden = (sectionKey: CvPrintSectionConfig["key"], itemId: string) => {
    const override = cvConfig.itemOverrides[getOverrideKey(sectionKey, itemId)];
    if (!override) return false;
    const fields = getOverrideFields(sectionKey, activeLocale);
    return fields.some((field) => {
      const value = override[field];
      return value !== null && value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
    });
  };

  const openOverrideEditor = (sectionKey: CvPrintSectionConfig["key"], itemId: string) => {
    const key = getOverrideKey(sectionKey, itemId);
    const original = data
      ? getItemOriginalValuesForLocale(sectionKey, itemId, data as HomepageData, activeLocale)
      : {};
    const existing = cvConfig.itemOverrides[key] || {};
    const fields = getOverrideFields(sectionKey, activeLocale);
    const draft: CvPrintItemOverride = {};
    fields.forEach((field) => {
      const existingValue = existing[field];
      const originalValue = original[field as keyof CvPrintItemOverride];
      if (field === "technologies" || field === "technologiesEn") {
        draft[field] = (existingValue as string[] | undefined) ?? (originalValue as string[] | undefined) ?? [];
      } else {
        draft[field] = (existingValue as string | null | undefined) ?? (originalValue as string | undefined) ?? "";
      }
    });
    setOverrideDraft(draft);
    setEditingOverride({ sectionKey, itemId });
  };

  const saveOverride = () => {
    if (!editingOverride || !data) return;
    const { sectionKey, itemId } = editingOverride;
    const key = getOverrideKey(sectionKey, itemId);
    const original = getItemOriginalValuesForLocale(sectionKey, itemId, data as HomepageData, activeLocale);
    const fields = getOverrideFields(sectionKey, activeLocale);

    const changed: CvPrintItemOverride = { ...cvConfig.itemOverrides[key] };
    fields.forEach((field) => {
      const draftValue = overrideDraft[field];
      const origValue = original[field as keyof CvPrintItemOverride];
      if (field === "technologies" || field === "technologiesEn") {
        const draftTechs = (draftValue as string[] | undefined) || [];
        const origTechs = (origValue as string[] | undefined) || [];
        const techsChanged =
          draftTechs.length !== origTechs.length ||
          draftTechs.some((t, i) => t.trim() !== (origTechs[i] || "").trim());
        if (techsChanged && draftTechs.length > 0) {
          changed[field] = draftTechs.map((t) => t.trim()).filter(Boolean);
        } else if (draftTechs.length === 0 && origTechs.length > 0) {
          changed[field] = null;
        } else {
          delete changed[field];
        }
      } else {
        const normalizedDraft = typeof draftValue === "string" ? draftValue.trim() : "";
        const normalizedOrig = typeof origValue === "string" ? origValue.trim() : "";
        const stringField = field as "title" | "subtitle" | "description" | "dateRange" | "titleEn" | "subtitleEn" | "descriptionEn" | "dateRangeEn";
        if (normalizedDraft && normalizedDraft !== normalizedOrig) {
          changed[stringField] = normalizedDraft;
        } else if (!normalizedDraft && normalizedOrig) {
          changed[stringField] = null;
        } else {
          delete changed[stringField];
        }
      }
    });

    setCvConfig((prev) => {
      const next = { ...prev.itemOverrides };
      if (Object.keys(changed).length === 0) {
        delete next[key];
      } else {
        next[key] = changed;
      }
      return { ...prev, itemOverrides: next };
    });
    setFormChanged(true);
    setEditingOverride(null);
  };

  const removeOverride = (sectionKey: CvPrintSectionConfig["key"], itemId: string) => {
    const key = getOverrideKey(sectionKey, itemId);
    const fields = getOverrideFields(sectionKey, activeLocale);
    setCvConfig((prev) => {
      const next = { ...prev.itemOverrides };
      const existing = next[key];
      if (existing) {
        fields.forEach((field) => delete existing[field]);
        if (Object.keys(existing).length === 0) {
          delete next[key];
        } else {
          next[key] = existing;
        }
      }
      return { ...prev, itemOverrides: next };
    });
    setFormChanged(true);
  };

  const toggleAccordion = (key: CvPrintSectionConfig["key"]) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Générateur de CV</h1>
        <p className="text-muted-foreground">Impossible de charger les données.</p>
      </div>
    );
  }

  const isSynchronized = status?.status === "synchronized";

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FileText size={26} />
            Générateur de CV
          </h1>
          <p className="text-muted-foreground mt-1">
            Prévisualisez votre CV et générez le fichier PDF prêt à être imprimé ou partagé.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isSynchronized
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
            }`}
          >
            {isSynchronized ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {isSynchronized ? "CV synchronisé" : "CV désynchronisé"}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground">
            <History size={14} />
            {status?.lastCvGeneratedAt
              ? `Dernière gén. ${formatDate(status.lastCvGeneratedAt)}`
              : "Jamais généré"}
          </div>
        </div>
      </div>

      {/* Alert message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Preview zone */}
        <div className="space-y-4">
          {/* Preview tabs */}
          <div className="flex items-center justify-between">
            <div className="inline-flex bg-muted rounded-lg p-1 border border-border">
              <button
                onClick={() => setMode("screen")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === "screen"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor size={16} />
                Aperçu écran
              </button>
              <button
                onClick={() => setMode("print")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === "print"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Printer size={16} />
                Aperçu print / PDF
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {mode === "screen" ? "Zoom confortable" : "Taille réelle A4"}
            </span>
          </div>

          {/* Canvas */}
          <div className="overflow-auto bg-gray-100 dark:bg-muted rounded-xl border border-border flex justify-center min-h-[600px] p-4">
            <div
              ref={cvRef}
              className={`shadow-lg ${mode === "screen" ? "scale-[0.92] origin-top" : ""}`}
              style={mode === "screen" ? { transform: "scale(0.92)", transformOrigin: "top center" } : {}}
            >
              <CVPrintTemplate
                profile={{
                  ...data.profile,
                  ...cvForm,
                  // Use public profile values as placeholders for empty cvPrint fields in the live preview
                  cvPrintFullName: cvForm.cvPrintFullName || data.profile.fullName,
                  cvPrintTitle: cvForm.cvPrintTitle || data.profile.title,
                  cvPrintTitleEn: cvForm.cvPrintTitleEn || data.profile.titleEn || data.profile.title,
                  cvPrintEmail: cvForm.cvPrintEmail || data.profile.email,
                  cvPrintPhone: cvForm.cvPrintPhone || data.profile.phone,
                  cvPrintLocation: cvForm.cvPrintLocation || data.profile.location,
                  cvPrintLinkedin: cvForm.cvPrintLinkedin || data.profile.linkedin,
                  cvPrintWebsite: cvForm.cvPrintWebsite || "abdenour-hellas.online",
                  cvPrintBio: cvForm.cvPrintBio || data.profile.bio,
                  cvPrintBioEn: cvForm.cvPrintBioEn || data.profile.bioEn || data.profile.bio,
                }}
                experiences={data.experiences || []}
                education={data.education || []}
                skills={data.skills || []}
                projects={data.projects || []}
                certifications={data.certifications || []}
                config={cvConfig}
                locale={activeLocale}
              />
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="space-y-5">
          {/* Locale switcher */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              Langue du CV
            </h2>
            <div className="inline-flex bg-muted rounded-lg p-1 border border-border w-full">
              <button
                type="button"
                onClick={() => setActiveLocale("fr")}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeLocale === "fr"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setActiveLocale("en")}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeLocale === "en"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Basculer entre les versions française et anglaise du CV.
            </p>
          </section>

          {/* Status card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Statut du CV
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">État</span>
                <span
                  className={`inline-flex items-center gap-1.5 font-medium ${
                    isSynchronized ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isSynchronized ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {isSynchronized ? "Synchronisé" : "Désynchronisé"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Template React</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {status?.templateHash ? status.templateHash.slice(0, 8) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">HTML statique</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {status?.htmlHash ? status.htmlHash.slice(0, 8) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dernière synchro</span>
                <span className="text-muted-foreground">{formatDate(status?.cvLastSyncedAt || null)}</span>
              </div>
              {!isSynchronized && status?.reason && (
                <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
                  {status.reason}
                </p>
              )}
            </div>
          </section>

          {/* Content card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Pencil size={18} className="text-primary" />
                Contenu du CV
              </h2>
              {formChanged && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-2 py-1 rounded-full">
                  Modifications non enregistrées
                </span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nom complet</label>
                <input
                  type="text"
                  value={cvForm.cvPrintFullName}
                  onChange={(e) => updateFormField("cvPrintFullName", e.target.value)}
                  placeholder={data.profile.fullName}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                />
              </div>
              {activeLocale === "fr" ? (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Titre / poste</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintTitle}
                    onChange={(e) => updateFormField("cvPrintTitle", e.target.value)}
                    placeholder={data.profile.title}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Title / position</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintTitleEn}
                    onChange={(e) => updateFormField("cvPrintTitleEn", e.target.value)}
                    placeholder={data.profile.titleEn || data.profile.title}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={cvForm.cvPrintEmail}
                    onChange={(e) => updateFormField("cvPrintEmail", e.target.value)}
                    placeholder={data.profile.email}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintPhone}
                    onChange={(e) => updateFormField("cvPrintPhone", e.target.value)}
                    placeholder={data.profile.phone}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Localisation</label>
                <input
                  type="text"
                  value={cvForm.cvPrintLocation}
                  onChange={(e) => updateFormField("cvPrintLocation", e.target.value)}
                  placeholder={data.profile.location}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintLinkedin}
                    onChange={(e) => updateFormField("cvPrintLinkedin", e.target.value)}
                    placeholder={data.profile.linkedin}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Site web</label>
                  <input
                    type="text"
                    value={cvForm.cvPrintWebsite}
                    onChange={(e) => updateFormField("cvPrintWebsite", e.target.value)}
                    placeholder="abdenour-hellas.online"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              {activeLocale === "fr" ? (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Bio / profil</label>
                  <textarea
                    value={cvForm.cvPrintBio}
                    onChange={(e) => updateFormField("cvPrintBio", e.target.value)}
                    placeholder={data.profile.bio}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Bio / profile</label>
                  <textarea
                    value={cvForm.cvPrintBioEn}
                    onChange={(e) => updateFormField("cvPrintBioEn", e.target.value)}
                    placeholder={data.profile.bioEn || data.profile.bio}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* Sections card */}
              <div className="pt-2 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Layers size={18} className="text-primary" />
                    Sections du CV
                  </h3>
                  <button
                    type="button"
                    onClick={resetCvConfig}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <RotateCcw size={12} />
                    Réinitialiser
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Glissez-déposez pour réordonner. Cochez/décochez pour afficher ou masquer. Laissez le libellé vide pour utiliser la valeur par défaut.
                </p>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleSectionDragEnd}
                >
                  <SortableContext items={cvConfig.sections.map((s) => s.key)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {cvConfig.sections.map((section) => (
                        <SortableCvSectionItem
                          key={section.key}
                          section={section}
                          locale={activeLocale}
                          onToggle={toggleSectionVisibility}
                          onLabelChange={updateSectionLabel}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Section content accordions */}
              <div className="pt-2 border-t border-border space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <ListChecks size={18} className="text-primary" />
                  Contenu des sections
                </h3>
                <p className="text-xs text-muted-foreground">
                  Choisissez les éléments à inclure, réordonnez-les et modifiez leurs champs pour le CV imprimé.
                </p>
                <div className="space-y-2">
                  {SELECTABLE_SECTIONS.map((sectionKey) => {
                    const items = getSectionItems(sectionKey, data);
                    const selectedIds = new Set(getSectionItemIds(sectionKey));
                    const selectedItems = items.filter((i) => selectedIds.has(i.id));
                    const unselectedItems = items.filter((i) => !selectedIds.has(i.id));
                    const isOpen = !!openAccordions[sectionKey];

                    return (
                      <div
                        key={sectionKey}
                        className="border border-border rounded-lg bg-card overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleAccordion(sectionKey)}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-sm flex items-center gap-2">
                            {getSectionUiLabel(sectionKey, activeLocale)}
                            <span className="text-xs text-muted-foreground font-normal">
                              ({selectedItems.length}/{items.length})
                            </span>
                          </span>
                          <ChevronDown
                            size={16}
                            className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-3 pt-0 space-y-3">
                            {items.length === 0 ? (
                              <p className="text-xs text-muted-foreground py-2">
                                Aucun élément disponible.
                              </p>
                            ) : (
                              <>
                                <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={(e) => handleItemDragEnd(sectionKey, e)}
                                >
                                  <SortableContext
                                    items={selectedItems.map((i) => i.id)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    <div className="space-y-1.5">
                                      {selectedItems.map((item) => (
                                        <SortableSectionContentItem
                                          key={item.id}
                                          id={item.id}
                                          title={item.title}
                                          selected={true}
                                          overridden={isOverridden(sectionKey, item.id)}
                                          onToggle={(id) => toggleItemSelection(sectionKey, id)}
                                          onEdit={(id) => openOverrideEditor(sectionKey, id)}
                                        />
                                      ))}
                                    </div>
                                  </SortableContext>
                                </DndContext>
                                {unselectedItems.length > 0 && (
                                  <div className="space-y-1.5 pt-2 border-t border-border">
                                    <p className="text-xs text-muted-foreground">Éléments non sélectionnés</p>
                                    {unselectedItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={false}
                                          onChange={() => toggleItemSelection(sectionKey, item.id)}
                                          className="rounded border-border text-primary focus:ring-primary"
                                        />
                                        <span className="flex-1 text-sm text-muted-foreground truncate">
                                          {item.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Laissez un champ vide pour utiliser la valeur du profil public.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveCvContent}
                  disabled={saving || !formChanged}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={resetForm}
                  disabled={!formChanged}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border bg-background text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={16} />
                  Réinitialiser
                </button>
              </div>
            </div>
          </section>

          {/* Actions card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Actions PDF
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleDownloadHtml2Pdf}
                disabled={generating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                {generating ? "Génération..." : "Télécharger le PDF"}
              </button>

              <button
                onClick={handlePrint}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-background text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <Printer size={16} />
                Imprimer
              </button>

              <button
                onClick={handleRegenerateHeadless}
                disabled={regenerating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-primary text-primary bg-primary/5 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                {regenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {regenerating ? "Régénération..." : "Régénérer le PDF (headless)"}
              </button>
            </div>
          </section>

          {/* Settings card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings2 size={18} className="text-primary" />
              Paramètres
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2">Mode de génération par défaut</label>
              <select
                value={status?.cvGenerationMode || "HEADLESS"}
                onChange={(e) => handleModeChange(e.target.value as "HEADLESS" | "HTML2PDF")}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-sm"
              >
                <option value="HEADLESS">Headless (Edge/Chrome serveur)</option>
                <option value="HTML2PDF">html2pdf.js (navigateur client)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                Headless produit un PDF identique au template HTML statique. html2pdf.js fonctionne partout.
              </p>
            </div>
          </section>

          {/* History card */}
          <section className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <History size={18} className="text-primary" />
              Historique des générations
            </h2>
            {logsLoading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune génération enregistrée.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg text-xs border ${
                      log.success
                        ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                        : "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">
                        {log.method === "HEADLESS" ? "Headless" : "html2pdf.js"}
                      </span>
                      <span className={log.success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                        {log.success ? "Succès" : "Échec"}
                      </span>
                    </div>
                    <div className="text-muted-foreground">{formatDate(log.generatedAt)}</div>
                    {log.fileSizeKb ? (
                      <div className="text-muted-foreground">{log.fileSizeKb} Ko</div>
                    ) : null}
                    {log.error ? <div className="text-red-600 mt-1">{log.error}</div> : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Override editor modal */}
      {editingOverride && (
        <OverrideEditor
          sectionKey={editingOverride.sectionKey}
          itemTitle={
            getSectionItems(editingOverride.sectionKey, data).find((i) => i.id === editingOverride.itemId)
              ?.title || ""
          }
          locale={activeLocale}
          draft={overrideDraft}
          onChange={setOverrideDraft}
          onSave={saveOverride}
          onCancel={() => setEditingOverride(null)}
          onRemove={() => {
            removeOverride(editingOverride.sectionKey, editingOverride.itemId);
            setEditingOverride(null);
          }}
        />
      )}
    </div>
  );
}
