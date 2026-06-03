"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Article } from "@/types";
import { Calendar, ArrowLeft, FileText } from "lucide-react";
import { Skeleton } from "@/components/public/Skeleton";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 max-w-3xl">
        <Skeleton className="h-4 w-32 mb-8" />
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-8" />
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 text-center max-w-3xl">
        <h1 className="text-xl font-semibold mb-3">Article non trouvé</h1>
        <Link href="/fr/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/fr/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Retour au blog
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Calendar size={11} />
          {new Date(article.createdAt).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-6">
          {article.title}
        </h1>

        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-56 md:h-72 object-cover rounded-xl mb-8"
          />
        ) : (
          <div className="w-full h-56 md:h-72 bg-muted rounded-xl mb-8 flex items-center justify-center">
            <FileText className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}

        <p className="text-base text-muted-foreground mb-6 leading-relaxed">{article.excerpt}</p>

        <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed">
          <div className="whitespace-pre-wrap text-foreground">{article.content}</div>
        </div>
      </motion.div>
    </div>
  );
}
