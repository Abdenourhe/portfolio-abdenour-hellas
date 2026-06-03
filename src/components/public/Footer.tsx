"use client";

import Link from "next/link";
import SocialIcons from "./SocialIcons";

export default function Footer({ locale, messages }: { locale: string; messages: any }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-primary-foreground">
              Abdenour Hellas
            </p>
            <p className="text-xs text-primary-foreground/60 mt-1">
              {messages.footer?.copyright?.replace("{year}", year.toString()) || `© ${year} Abdenour Hellas`}
            </p>
          </div>

          <SocialIcons
            linkedin="https://linkedin.com/in/abdenour-hellas"
            github="https://github.com/Abdenourhe"
          />

          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/cv`}
              className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              CV
            </Link>
            <span className="text-primary-foreground/30">·</span>
            <Link
              href={`/${locale}/contact`}
              className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              {messages.nav?.contact || "Contact"}
            </Link>
            <span className="text-primary-foreground/30">·</span>
            <Link
              href="/admin/login"
              className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
