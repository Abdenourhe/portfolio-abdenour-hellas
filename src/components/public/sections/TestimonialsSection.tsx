"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/types";
import { Quote, User } from "lucide-react";
import { Skeleton } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import AnimatedSection, { fadeUpItem } from "@/components/public/AnimatedSection";

interface TestimonialsSectionProps {
  data?: Testimonial[];
  compact?: boolean;
  limit?: number;
}

export default function TestimonialsSection({ data, compact = false, limit }: TestimonialsSectionProps) {
  const t = useT();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(data || []);
  const displayTestimonials = limit ? testimonials.slice(0, limit) : testimonials;
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) return;
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [data]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    );
  }

  return (
    <AnimatedSection stagger={0.1} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayTestimonials.map((item) => (
        <motion.div
          key={item.id}
          variants={fadeUpItem}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all flex flex-col ${compact ? "p-5" : "p-6"}`}
        >
          <Quote className="w-5 h-5 text-secondary/60 mb-4 flex-shrink-0" />
          <p className="text-base text-muted-foreground leading-relaxed flex-1">{item.content}</p>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/60">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center">
                <User className="w-4 h-4 text-primary/60" />
              </div>
            )}
            <div>
              <p className="text-base font-medium text-primary">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.role} · {item.company}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatedSection>
  );
}
