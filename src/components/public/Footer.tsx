"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialIcons from "./SocialIcons";

export default function Footer({ locale, messages }: { locale: string; messages: any }) {
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data));
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: messages.nav.home },
    { href: `/${locale}/about`, label: messages.nav.about },
    { href: `/${locale}/experience`, label: messages.nav.experience },
    { href: `/${locale}/skills`, label: messages.nav.skills },
    { href: `/${locale}/projects`, label: messages.nav.projects },
    { href: `/${locale}/contact`, label: messages.nav.contact },
  ];

  return (
    <footer className="border-t border-border bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">{profile?.fullName || "Abdenour Hellas"}</h3>
            <p className="text-sm text-muted-foreground">{profile?.title || "Ingénieur en Génie Électrique"}</p>
            <p className="text-sm text-muted-foreground mt-2">{profile?.email || "Abdenour.Hellas@uqat.ca"}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Liens rapides</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Réseaux sociaux</h3>
            <SocialIcons
              linkedin={profile?.linkedin}
              github={profile?.github}
              twitter={profile?.twitter}
              facebook={profile?.facebook}
            />
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {messages.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
