"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Article } from "@/types";
import { Calendar, ArrowRight, FileText } from "lucide-react";

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Blog</h1>
        <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          Articles, réflexions et partages sur l&apos;ingénierie, la technologie et mes projets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/fr/blog/${article.slug}`} className="block h-full">
                <div className="h-full rounded-xl bg-card border border-border overflow-hidden hover:border-primary transition-all hover:shadow-lg">
                  {article.imageUrl ? (
                    <div className="w-full h-40 overflow-hidden">
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar size={12} />
                      {new Date(article.createdAt).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary">
                      Lire l&apos;article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
