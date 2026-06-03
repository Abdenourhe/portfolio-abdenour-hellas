"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Article } from "@/types";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import SectionHeader from "@/components/public/SectionHeader";
import { Skeleton } from "@/components/public/Skeleton";
import { useT } from "@/components/public/I18nProvider";
import { useLocale } from "@/components/public/useLocale";

export default function BlogPage() {
  const t = useT();
  const locale = useLocale();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <SectionHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />

      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link href={`/${locale}/blog/${article.slug}`} className="block h-full group">
              <div className="h-full rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors">
                {article.imageUrl ? (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-muted flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary/20" />
                  </div>
                )}
                <div className="p-5">
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
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
