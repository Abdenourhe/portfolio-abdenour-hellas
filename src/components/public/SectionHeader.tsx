"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`flex items-center gap-5 ${centered ? "justify-center" : ""}`}
      >
        <h2
          className="font-[family-name:var(--font-serif)] text-[0.8rem] md:text-[0.85rem] font-normal tracking-[0.22em] uppercase text-foreground whitespace-nowrap"
        >
          {title}
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="h-px bg-border origin-left"
          style={{ width: centered ? "clamp(3rem, 10vw, 8rem)" : "clamp(3rem, 10vw, 8rem)" }}
        />
      </motion.div>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-muted-foreground text-sm md:text-base max-w-lg leading-[1.7] font-sans"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
