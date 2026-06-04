"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

const translations: Record<string, { title: string; description: string; home: string; back: string }> = {
  fr: {
    title: "Page introuvable",
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
    home: "Retour à l'accueil",
    back: "Page précédente",
  },
  en: {
    title: "Page not found",
    description: "The page you are looking for does not exist or has been moved.",
    home: "Back to home",
    back: "Previous page",
  },
  ar: {
    title: "الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    home: "العودة إلى الرئيسية",
    back: "الصفحة السابقة",
  },
};

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  let locale = "fr";
  try {
    const p = await params;
    locale = p.locale || "fr";
  } catch {
    // ignore
  }

  const t = translations[locale] || translations.fr;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold tracking-tighter text-primary/10 select-none">404</h1>
        <h2 className="text-xl font-semibold text-primary -mt-4 mb-3">{t.title}</h2>
        <p className="text-sm text-muted-foreground mb-8">{t.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Home size={16} />
            {t.home}
          </Link>
          <button
            onClick={() => typeof window !== "undefined" && window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
          >
            <ArrowLeft size={16} />
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
}
