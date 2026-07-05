import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Amiri } from "next/font/google";
import { isValidLocale, Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-serif-ar",
  display: "swap",
});
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { ThemeProvider } from "@/components/public/ThemeProvider";
import { I18nProvider } from "@/components/public/I18nProvider";
import NetworkCanvas from "@/components/public/NetworkCanvas";
import ReadingProgress from "@/components/public/ReadingProgress";
import CustomCursor from "@/components/public/CustomCursor";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://abdenour-hellas.online";
}

async function getProfile() {
  try {
    return await prisma.profile.findFirst();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const profile = await getProfile();

  const baseTitle = {
    fr: "Abdenour Hellas — Spécialiste en génie électrique & développement web",
    en: "Abdenour Hellas — Electrical Engineering Specialist & Web Developer",
    ar: "عبد النور حلاس — أخصائي في الهندسة الكهربائية وتطوير الويب",
  };

  const title = profile?.fullName
    ? locale === "ar" && profile.titleAr
      ? `${profile.fullName} — ${profile.titleAr}`
      : locale === "en" && profile.titleEn
      ? `${profile.fullName} — ${profile.titleEn}`
      : `${profile.fullName} — ${profile.title || baseTitle[locale as keyof typeof baseTitle]}`
    : baseTitle[locale as keyof typeof baseTitle] || baseTitle.fr;

  const description =
    (locale === "ar" && profile?.bioAr) ||
    (locale === "en" && profile?.bioEn) ||
    profile?.bio ||
    {
      fr: "Portfolio d'Abdenour Hellas, spécialiste en génie électrique et développement web.",
      en: "Portfolio of Abdenour Hellas, electrical engineering specialist and web developer.",
      ar: "محفظة عبد النور حلاس، أخصائي في الهندسة الكهربائية وتطوير الويب.",
    }[locale] ||
    baseTitle.fr;

  const ogImage = profile?.photoUrl || undefined;

  return {
    title,
    description,
    metadataBase: new URL(getBaseUrl()),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
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

  const profile = await getProfile();
  const personSchema = profile
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.fullName,
        jobTitle: profile.title,
        description: profile.bio,
        image: profile.photoUrl,
        email: profile.email,
        telephone: profile.phone,
        address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location } : undefined,
        url: getBaseUrl(),
        sameAs: [profile.linkedin, profile.github, profile.twitter, profile.facebook, profile.instagram].filter(Boolean),
      }
    : null;

  return (
    <ThemeProvider>
      <I18nProvider messages={messages}>
        {personSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          />
        )}
        <NetworkCanvas />
        <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`min-h-screen flex flex-col relative z-10 ${playfair.variable} ${amiri.variable}`}>
          <ReadingProgress />
          <CustomCursor />
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
