"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowLeft, FileText, Clock } from "lucide-react";
import { Article } from "@/types";
import ShareButtons from "@/components/public/ShareButtons";
import { readingTime } from "@/lib/readingTime";

interface ArticleContentProps {
  article: Article;
  locale: string;
  backText: string;
}

export default function ArticleContent({ article, locale, backText }: ArticleContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {backText}
      </Link>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={11} />
          {new Date(article.createdAt).toLocaleDateString(locale === "fr" ? "fr-CA" : locale === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={11} />
          {readingTime(article.content)}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary mb-6">
        {article.title}
      </h1>

      {article.imageUrl ? (
        <div className="relative w-full h-56 md:h-72 rounded-xl mb-8 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="w-full h-56 md:h-72 bg-muted rounded-xl mb-8 flex items-center justify-center">
          <FileText className="w-10 h-10 text-primary/20" />
        </div>
      )}

      <p className="text-base text-muted-foreground mb-6 leading-relaxed">{article.excerpt}</p>

      <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed">
        <div className="whitespace-pre-wrap text-foreground">{article.content}</div>
      </div>

      <div className="mt-10 pt-6 border-t border-border">
        <ShareButtons
          url={typeof window !== "undefined" ? window.location.href : `https://abdenour-hellas.online/${locale}/blog/${article.slug}`}
          title={article.title}
          description={article.excerpt}
        />
      </div>
    </motion.div>
  );
}
