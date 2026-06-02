import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "@/i18n/config";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { ThemeProvider } from "@/components/public/ThemeProvider";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
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
      <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen flex flex-col">
        <Header locale={locale} messages={messages} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} messages={messages} />
      </div>
    </ThemeProvider>
  );
}
