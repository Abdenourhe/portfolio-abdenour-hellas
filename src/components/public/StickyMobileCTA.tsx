"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useLocalizedPath } from "@/hooks/useLocale";

export default function StickyMobileCTA() {
  const locale = useLocale();
  const cvPath = useLocalizedPath("/cv");
  const contactPath = useLocalizedPath("/contact");
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const labels = {
    fr: { cv: "Voir mon CV", contact: "Me contacter", cta: "Discutons" },
    en: { cv: "View CV", contact: "Contact me", cta: "Let's talk" },
    ar: { cv: "عرض السيرة", contact: "تواصل معي", cta: "لنتحدث" },
  };

  const t = labels[locale as keyof typeof labels] || labels.fr;

  return (
    <>
      {/* Mobile: barre en bas */}
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

      {/* Desktop: bouton flottant */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-2 print:hidden"
          >
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2 mb-1"
                >
                  <Link
                    href={cvPath}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:border-primary/40 hover:bg-primary/[0.06] transition-colors shadow-lg"
                  >
                    <FileText size={16} />
                    {t.cv}
                  </Link>
                  <Link
                    href={contactPath}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    <Send size={16} />
                    {t.contact}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl hover:bg-primary/90 transition-colors"
              aria-label={expanded ? "Fermer" : t.cta}
            >
              <AnimatePresence mode="wait">
                {expanded ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Send size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
