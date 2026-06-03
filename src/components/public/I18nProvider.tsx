"use client";

import React, { createContext, useContext } from "react";

const I18nContext = createContext<Record<string, any> | null>(null);

export function I18nProvider({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: Record<string, any>;
}) {
  return <I18nContext.Provider value={messages}>{children}</I18nContext.Provider>;
}

export function useI18n(): Record<string, any> {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function useT(): (path: string) => string {
  const messages = useI18n();
  return (path: string) => {
    const keys = path.split(".");
    let value: any = messages;
    for (const key of keys) {
      value = value?.[key];
    }
    return typeof value === "string" ? value : path;
  };
}
