"use client";

import { useRouter, usePathname } from "next/navigation";
import { locales, Locale } from "@/i18n/config";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-muted-foreground/15 rounded-lg p-1">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 text-sm rounded-md transition-colors ${
            l === locale
              ? "bg-primary text-white"
              : "text-foreground hover:bg-muted-foreground/20"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
