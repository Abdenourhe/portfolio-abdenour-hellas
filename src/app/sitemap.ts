import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://portfolio-abdenour-hellas.vercel.app";
  const locales = ["fr", "en", "ar"];
  const routes = ["", "about", "cv", "contact", "blog", "experience", "education", "skills", "projects", "testimonials"];

  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route ? `/${route}` : ""}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.7,
      });
    }
  }

  // Dynamic articles
  try {
    const articles = await prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
    for (const locale of locales) {
      for (const article of articles) {
        sitemap.push({
          url: `${baseUrl}/${locale}/blog/${article.slug}`,
          lastModified: article.updatedAt || new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // ignore DB errors in sitemap
  }

  return sitemap;
}
