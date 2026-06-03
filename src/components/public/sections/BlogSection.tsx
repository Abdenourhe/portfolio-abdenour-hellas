"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Article } from "@/types";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { Skeleton } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import { useLocale } from "@/components/public/useLocale";
import AnimatedSection, { fadeUpItem } from "@/components/public/AnimatedSection";

interface BlogSectionProps {
  data?: Article[];
  compact?: boolean;
  limit?: number;
}

export default function BlogSection({ data, compact = false, limit }: BlogSectionProps) {
  const t = useT();
  const locale = useLocale();
  const [articles, setArticles] = useState<Article[]>(data || []);
  const displayArticles = limit ? articles.slice(0, limit) : articles;
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) return;
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [data]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatedSection stagger={0.1} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayArticles.map((article) => (
        <motion.div key={article.id} variants={fadeUpItem}>
          <Link href={`/${locale}/blog/${article.slug}`} className="block h-full group">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all"
            >
              {article.imageUrl ? (
                <div className="w-full h-44 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
              ) : (
                <div className="w-full h-44 bg-muted flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary/20" />
                </div>
              )}
              <div className={compact ? "p-4" : "p-5"}>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Calendar size={11} />
                  {new Date(article.createdAt).toLocaleDateString(locale === "fr" ? "fr-CA" : locale === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <h3 className="text-base font-semibold text-primary group-hover:text-primary/80 transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-xs text-secondary font-medium">
                  {t("blog.read")} <ArrowRight size={12} />
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </AnimatedSection>
  );
}
