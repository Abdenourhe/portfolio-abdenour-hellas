import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  let article;
  try {
    article = await prisma.article.findFirst({
      where: { slug, published: true },
      select: { title: true, excerpt: true },
    });
  } catch {
    article = null;
  }

  const title = article?.title || "Blog";
  const description = article?.excerpt || "";

  const suffixes: Record<string, string> = {
    fr: " | Blog",
    en: " | Blog",
    ar: " | المدونة",
  };

  return {
    title: `${title}${suffixes[locale] || suffixes.fr}`,
    description,
  };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
