"use client";

export type AdminLang = "fr" | "en" | "ar";

export const LANG_SUFFIX: Record<AdminLang, string> = { fr: "", en: "En", ar: "Ar" };
export const LANG_LABEL: Record<AdminLang, string> = { fr: "FR", en: "EN", ar: "AR" };

/** Builds the field key for a translatable field, e.g. fieldKey("title", "en") -> "titleEn" */
export function fieldKey(base: string, lang: AdminLang): string {
  return `${base}${LANG_SUFFIX[lang]}`;
}

export default function LangTabs({
  value,
  onChange,
}: {
  value: AdminLang;
  onChange: (lang: AdminLang) => void;
}) {
  return (
    <div className="flex gap-1 mb-2">
      {(["fr", "en", "ar"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            value === lang
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {LANG_LABEL[lang]}
        </button>
      ))}
    </div>
  );
}
