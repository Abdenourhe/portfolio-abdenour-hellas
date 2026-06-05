"use client";

import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2 className={`text-xl md:text-2xl font-semibold tracking-tight text-foreground ${centered ? "" : ""}`}>
        <TextReveal text={title} delay={0.1} />
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-2 text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-3 h-px w-12 bg-secondary mx-auto"
      />
    </div>
  );
}
