import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleContent from "@/components/public/ArticleContent";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://abdenour-hellas.online";
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = getBaseUrl();

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    return {
      title: locale === "fr" ? "Article non trouvé" : locale === "ar" ? "المقال غير موجود" : "Article not found",
      metadataBase: new URL(baseUrl),
    };
  }

  const title = article.title;
  const description = article.excerpt;
  const ogImage = article.imageUrl || undefined;

  return {
    title: `${title} — Blog | Abdenour Hellas`,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      locale: locale === "ar" ? "ar_SA" : locale,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28 max-w-3xl">
      <ArticleContent article={article} locale={locale} backText={messages.blog.back} />
    </div>
  );
}
