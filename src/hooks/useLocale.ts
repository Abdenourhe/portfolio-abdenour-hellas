"use client";

import { useParams } from "next/navigation";

export function useLocale(): string {
  const params = useParams();
  return (params?.locale as string) || "fr";
}

export function useLocalizedPath(path: string): string {
  const locale = useLocale();
  if (path.startsWith("/")) {
    return `/${locale}${path}`;
  }
  return path;
}
