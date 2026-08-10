"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronUp } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale } from "@/i18n/config";

export default function Header({ locale, messages }: { locale: Locale; messages: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { href: `/${locale}`, label: messages.nav.home, prefetch: true },
    { href: `/${locale}/about`, label: messages.nav.about, prefetch: true },
    { href: `/${locale}/education`, label: messages.nav.education, prefetch: false },
    { href: `/${locale}/experience`, label: messages.nav.experience, prefetch: false },
    { href: `/${locale}/skills`, label: messages.nav.skills, prefetch: false },
    { href: `/${locale}/projects`, label: messages.nav.projects, prefetch: false },
    { href: `/${locale}/testimonials`, label: messages.nav.testimonials, prefetch: false },
    { href: `/${locale}/blog`, label: messages.nav.blog, prefetch: false },
    { href: `/${locale}/contact`, label: messages.nav.contact, prefetch: true },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-[0_1px_0_0_var(--border)]"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="font-[family-name:var(--font-serif)] text-base font-medium tracking-[0.02em] text-foreground hover:text-muted-foreground transition-colors"
        >
          Abdenour Hellas
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation principale">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={item.prefetch}
                aria-current={active ? "page" : undefined}
                className={`relative text-[0.82rem] tracking-[0.03em] font-normal transition-colors pb-0.5 ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-secondary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <ThemeSelector />
        </div>

        <button
          className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-background/98 backdrop-blur-xl border-t border-border/40 overflow-y-auto"
        >
          <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.prefetch}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-3 text-sm tracking-wide transition-colors min-h-[44px] flex items-center rounded-md ${
                    active
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border/40">
              <LanguageSwitcher locale={locale} />
              <ThemeSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <ChevronUp size={20} />
    </button>
  );
}
