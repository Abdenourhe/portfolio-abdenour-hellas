import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "@/i18n/config";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { ThemeProvider } from "@/components/public/ThemeProvider";
import { I18nProvider } from "@/components/public/I18nProvider";
import BlueprintBackground from "@/components/public/BlueprintBackground";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Abdenour Hellas — Ingénieur en Génie Électrique",
    en: "Abdenour Hellas — Electrical Engineer",
    ar: "عبد النور حلاس — مهندس كهربائي",
  };
  const descriptions: Record<string, string> = {
    fr: "Portfolio d'Abdenour Hellas, ingénieur en génie électrique spécialisé en automatisation, supervision et systèmes embarqués.",
    en: "Portfolio of Abdenour Hellas, electrical engineer specialized in automation, supervision and embedded systems.",
    ar: "محفظة عبد النور حلاس، مهندس كهربائي متخصص في الأتمتة والإشراف والأنظمة المدمجة.",
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale,
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      languages: {
        fr: "/fr",
        en: "/en",
        ar: "/ar",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <ThemeProvider>
      <I18nProvider messages={messages}>
        <BlueprintBackground />
        <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen flex flex-col relative z-10">
          <div className="print:hidden">
            <Header locale={locale as Locale} messages={messages} />
          </div>
          <main className="flex-1">{children}</main>
          <div className="print:hidden">
            <Footer locale={locale} messages={messages} />
          </div>
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
