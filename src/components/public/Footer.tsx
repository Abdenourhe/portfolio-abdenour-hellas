"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SocialIcons from "./SocialIcons";

export default function Footer({ locale, messages }: { locale: string; messages: any }) {
  const year = new Date().getFullYear();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-foreground">
              Abdenour Hellas
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {messages.footer?.rights?.replace("{year}", year.toString()) || `© ${year} Abdenour Hellas`}
            </p>
          </div>

          <SocialIcons
            linkedin={profile?.linkedin}
            github={profile?.github}
            twitter={profile?.twitter}
            facebook={profile?.facebook}
            instagram={profile?.instagram}
            whatsapp={profile?.whatsapp}
          />

          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/cv`}
              prefetch={false}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              CV
            </Link>
            <span className="text-border">·</span>
            <Link
              href={`/${locale}/contact`}
              prefetch={false}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {messages.nav?.contact || "Contact"}
            </Link>
            <span className="text-border">·</span>
            <Link
              href="/admin/login"
              prefetch={false}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
