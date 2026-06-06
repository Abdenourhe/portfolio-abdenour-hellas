"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/types";
import { Quote, User, ChevronLeft, ChevronRight } from "lucide-react";
import ElectricCard from "@/components/public/ElectricCard";
import { Skeleton } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";

interface TestimonialsSectionProps {
  data?: Testimonial[];
  compact?: boolean;
  limit?: number;
}

export default function TestimonialsSection({ data, compact = false, limit }: TestimonialsSectionProps) {
  const t = useT();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(data || []);
  const [loading, setLoading] = useState(!data);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const displayTestimonials = limit ? testimonials.slice(0, limit) : testimonials;

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

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    const cardWidth = el.firstElementChild?.clientWidth || el.clientWidth;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(idx, Math.max(0, displayTestimonials.length - 1)));
  }, [displayTestimonials.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  useEffect(() => {
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollState]);

  const scrollByDir = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || el.clientWidth;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  const totalDots = displayTestimonials.length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[85vw] md:min-w-[calc(50%-10px)] lg:min-w-[calc(33.333%-14px)] p-6 rounded-xl border border-border bg-card space-y-4">
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

  if (displayTestimonials.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative group">
        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayTestimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group snap-start shrink-0 w-[85vw] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            >
              <ElectricCard className="rounded-xl h-full">
                <div className={`bg-card hover:shadow-lg transition-all h-full rounded-xl flex flex-col ${compact ? "p-5" : "p-6"}`}>
              <Quote className="w-5 h-5 text-secondary/60 mb-4 flex-shrink-0" />
              <p className="text-base text-muted-foreground leading-relaxed flex-1">{item.content}</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/60">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary/60" />
                  </div>
                )}
                <div>
                  <p className="text-base font-medium text-primary">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role} · {item.company}</p>
                </div>
                  </div>
                </div>
              </ElectricCard>
            </motion.div>
          ))}
        </div>

        {/* Navigation arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scrollByDir(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center text-primary hover:bg-background hover:border-primary/30 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scrollByDir(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center text-primary hover:bg-background hover:border-primary/30 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Dots */}
      {totalDots > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardWidth = el.firstElementChild?.clientWidth || el.clientWidth;
                el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-8 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
