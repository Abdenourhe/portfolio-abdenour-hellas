import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Amiri } from "next/font/google";
import { isValidLocale, Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { isValidOgImage } from "@/lib/isValidOgImage";
import { getBaseUrl } from "@/lib/getBaseUrl";
import Header, { ScrollToTop } from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { ThemeProvider } from "@/components/public/ThemeProvider";
import { I18nProvider } from "@/components/public/I18nProvider";
import NetworkCanvas from "@/components/public/NetworkCanvas";
import ReadingProgress from "@/components/public/ReadingProgress";
import CustomCursor from "@/components/public/CustomCursor";
import BreadcrumbSchema from "@/components/public/BreadcrumbSchema";
import StickyMobileCTA from "@/components/public/StickyMobileCTA";

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

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
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

  const defaultDescriptions = {
    fr: "Ingénieur en génie électrique et développeur web full-stack. 5+ ans d'expérience en automatisation industrielle, maintenance électrique et conception de systèmes énergétiques. Disponible pour des opportunités au Canada et à l'international.",
    en: "Electrical engineer and full-stack web developer. 5+ years of experience in industrial automation, electrical maintenance and energy systems design. Open to opportunities in Canada and internationally.",
    ar: "مهندس كهربائي ومطور ويب متكامل. أكثر من 5 سنوات من الخبرة في الأتمتة الصناعية والصيانة الكهربائية وتصميم أنظمة الطاقة. متاح لفرص في كندا ودولياً.",
  };

  const description =
    (locale === "ar" && profile?.bioAr) ||
    (locale === "en" && profile?.bioEn) ||
    profile?.bio ||
    defaultDescriptions[locale as keyof typeof defaultDescriptions] ||
    defaultDescriptions.fr;

  const baseUrl = getBaseUrl();
  const ogImage = isValidOgImage(profile?.photoUrl) ? profile.photoUrl : `${baseUrl}/og-default.jpg`;

  return {
    title,
    description,
    keywords: [
      "ingénieur électrique",
      "génie électrique",
      "développeur web",
      "automatisation industrielle",
      "PLC",
      "maintenance électrique",
      "React",
      "Next.js",
      "Canada",
      "Abdenour Hellas",
    ],
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
    manifest: `${baseUrl}/manifest.json`,
    themeColor: "#1E3A5F",
    icons: {
      icon: [
        { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: { url: "/icon-192x192.png", sizes: "192x192" },
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

  const skipLabel = locale === "fr" ? "Passer au contenu" : locale === "ar" ? "تخطي إلى المحتوى" : "Skip to content";
  const baseUrl = getBaseUrl();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        {skipLabel}
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var theme = localStorage.getItem('theme');
              var dark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
              if (dark) document.documentElement.classList.add('dark');
              document.documentElement.classList.add('no-transition');
              window.addEventListener('load', function() {
                setTimeout(function() {
                  document.documentElement.classList.remove('no-transition');
                  document.documentElement.classList.add('transition-theme');
                }, 100);
              });
            })();
          `,
        }}
      />
      {gaId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_location: window.location.href });
              `,
            }}
          />
        </>
      )}
      {clarityId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `,
          }}
        />
      )}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `,
        }}
      />
      <ThemeProvider>
        <I18nProvider messages={messages}>
          {personSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
          )}
          <BreadcrumbSchema locale={locale} baseUrl={baseUrl} />
          <NetworkCanvas />
          <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`min-h-screen flex flex-col relative z-10 ${playfair.variable} ${amiri.variable}`}>
            <ReadingProgress />
            <CustomCursor />
            <div className="print:hidden">
              <Header locale={locale as Locale} messages={messages} />
            </div>
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <div className="print:hidden">
              <Footer locale={locale} messages={messages} />
            </div>
            <StickyMobileCTA />
            <ScrollToTop />
          </div>
        </I18nProvider>
      </ThemeProvider>
    </>
  );
}
