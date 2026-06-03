"use client";

import Link from "next/link";
import SocialIcons from "./SocialIcons";

export default function Footer({ locale, messages }: { locale: string; messages: any }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-white">
              Abdenour Hellas
            </p>
            <p className="text-xs text-white/60 mt-1">
              {messages.footer?.rights?.replace("{year}", year.toString()) || `© ${year} Abdenour Hellas`}
            </p>
          </div>

          <SocialIcons
            linkedin="https://linkedin.com/in/abdenour-hellas"
            github="https://github.com/Abdenourhe"
            light
          />

          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/cv`}
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              CV
            </Link>
            <span className="text-white/30">·</span>
            <Link
              href={`/${locale}/contact`}
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              {messages.nav?.contact || "Contact"}
            </Link>
            <span className="text-white/30">·</span>
            <Link
              href="/admin/login"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
