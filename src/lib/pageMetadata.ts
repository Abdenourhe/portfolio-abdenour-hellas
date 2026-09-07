import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/getBaseUrl";

export function buildPageMetadata({
  locale,
  path,
  titles,
  descriptions,
}: {
  locale: string;
  /** Path segment after the locale, e.g. "/cv" (no trailing slash) */
  path: string;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
}): Metadata {
  const baseUrl = getBaseUrl();
  const title = titles[locale] || titles.fr;
  const description = descriptions[locale] || descriptions.fr;
  const url = `${baseUrl}/${locale}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        fr: `${baseUrl}/fr${path}`,
        en: `${baseUrl}/en${path}`,
        ar: `${baseUrl}/ar${path}`,
      },
    },
  };
}
