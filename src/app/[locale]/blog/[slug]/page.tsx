"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Article } from "@/types";
import { Calendar, ArrowLeft, FileText } from "lucide-react";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
        <Link href="/fr/blog" className="text-primary hover:underline">
          Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/fr/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} />
          Retour au blog
        </Link>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar size={14} />
          {new Date(article.createdAt).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>

        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-80 object-cover rounded-xl mb-8" />
        ) : (
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-muted to-muted/50 rounded-xl mb-8 flex items-center justify-center">
            <FileText className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">{article.content}</div>
        </div>
      </motion.div>
    </div>
  );
}
