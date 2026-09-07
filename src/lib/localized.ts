export function getLocalizedField(
  obj: Record<string, any> | null | undefined,
  field: string,
  locale: string
): string {
  if (!obj) return "";
  if (locale === "en" && obj[`${field}En`]) return obj[`${field}En`];
  if (locale === "ar" && obj[`${field}Ar`]) return obj[`${field}Ar`];
  return obj[field] || "";
}
