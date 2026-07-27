"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ElementType;
  description: string;
};

const options: ThemeOption[] = [
  { value: "light", label: "Clair", icon: Sun, description: "Thème clair" },
  { value: "dark", label: "Sombre", icon: Moon, description: "Thème sombre" },
  { value: "system", label: "Système", icon: Monitor, description: "Selon votre appareil" },
];

export default function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const ActiveIcon = options.find((o) => o.value === resolvedTheme)?.icon || Sun;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
        aria-label="Choisir le thème"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ActiveIcon size={15} className="transition-transform duration-300" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-popover shadow-lg shadow-black/10 p-1.5 z-50"
          role="listbox"
          aria-label="Sélection du thème"
        >
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                role="option"
                aria-selected={isActive}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
                {isActive && <Check size={14} className="text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
