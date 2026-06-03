"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/public/I18nProvider";

const sections = [
  { id: "experience", labelKey: "experience.title" },
  { id: "education", labelKey: "education.title" },
  { id: "skills", labelKey: "skills.title" },
  { id: "projects", labelKey: "projects.title" },
  { id: "testimonials", labelKey: "testimonials.title" },
  { id: "blog", labelKey: "blog.title" },
];

export default function HomeNav() {
  const t = useT();
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-16 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl hidden lg:block">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {sections.map(({ id, labelKey }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                active === id
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
