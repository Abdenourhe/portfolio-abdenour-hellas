"use client";

import Link from "next/link";
import { FileText, Send } from "lucide-react";
import { useLocale, useLocalizedPath } from "@/hooks/useLocale";

export default function StickyMobileCTA() {
  const locale = useLocale();
  const cvPath = useLocalizedPath("/cv");
  const contactPath = useLocalizedPath("/contact");

  const labels = {
    fr: { cv: "Voir mon CV", contact: "Me contacter" },
    en: { cv: "View CV", contact: "Contact me" },
    ar: { cv: "عرض السيرة", contact: "تواصل معي" },
  };

  const t = labels[locale as keyof typeof labels] || labels.fr;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden print:hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-background/95 backdrop-blur-xl border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <Link
          href={cvPath}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <FileText size={16} />
          {t.cv}
        </Link>
        <Link
          href={contactPath}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/30 hover:bg-primary/[0.06] transition-colors"
        >
          <Send size={16} />
          {t.contact}
        </Link>
      </div>
    </div>
  );
}
