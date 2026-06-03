"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/types";
import { Quote, User } from "lucide-react";
import SectionHeader from "@/components/public/SectionHeader";
import { Skeleton } from "@/components/public/Skeleton";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <SectionHeader title="Témoignages" subtitle="Ce que disent mes collaborateurs." />
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title="Témoignages" subtitle="Ce que disent mes collaborateurs." />

      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors flex flex-col"
          >
            <Quote className="w-5 h-5 text-secondary/60 mb-4 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.content}</p>
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/60">
              {t.imageUrl ? (
                <img src={t.imageUrl} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary/60" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-primary">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
