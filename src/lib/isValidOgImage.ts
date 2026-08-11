export function isValidOgImage(url: string | null | undefined): url is string {
  return typeof url === "string" && /^https?:\/\//.test(url);
}
