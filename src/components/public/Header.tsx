"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale } from "@/i18n/config";

export default function Header({ locale, messages }: { locale: Locale; messages: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}`, label: messages.nav.home },
    { href: `/${locale}/about`, label: messages.nav.about },
    { href: `/${locale}/experience`, label: messages.nav.experience },
    { href: `/${locale}/skills`, label: messages.nav.skills },
    { href: `/${locale}/projects`, label: messages.nav.projects },
    { href: `/${locale}/testimonials`, label: messages.nav.testimonials },
    { href: `/${locale}/blog`, label: messages.nav.blog },
    { href: `/${locale}/contact`, label: messages.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="font-[family-name:var(--font-serif)] text-base font-medium tracking-[0.02em] text-foreground hover:text-muted-foreground transition-colors"
        >
          Abdenour Hellas
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`relative text-[0.82rem] tracking-[0.03em] font-normal transition-colors pb-0.5 ${
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-secondary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <button
            onClick={toggleTheme}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <button
          className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`px-3 py-3 text-sm tracking-wide transition-colors min-h-[44px] flex items-center ${
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border/40">
              <LanguageSwitcher locale={locale} />
              <button
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
