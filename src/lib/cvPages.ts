export type CvLocale = "fr" | "en" | "ar";

export const DEFAULT_CV_PAGE_RANGES: Record<CvLocale, [number, number]> = {
  fr: [1, 2],
  en: [3, 4],
  ar: [5, 6],
};

export function getCvPageRange(
  cvPageRanges: unknown,
  locale: CvLocale
): [number, number] {
  const ranges = (cvPageRanges as Record<string, [number, number]> | null) || null;
  const range = ranges?.[locale];
  if (Array.isArray(range) && range.length === 2 && range[0] > 0 && range[1] >= range[0]) {
    return [range[0], range[1]];
  }
  return DEFAULT_CV_PAGE_RANGES[locale];
}

/** Downloads only the given page range of a PDF (1-indexed, inclusive) as a new file. */
export async function downloadCvPageRange(
  cvUrl: string,
  fileName: string,
  startPage: number,
  endPage: number
) {
  const { PDFDocument } = await import("pdf-lib");

  const res = await fetch(cvUrl);
  const sourceBytes = await res.arrayBuffer();
  const sourceDoc = await PDFDocument.load(sourceBytes);

  const totalPages = sourceDoc.getPageCount();
  const safeStart = Math.max(1, Math.min(startPage, totalPages));
  const safeEnd = Math.max(safeStart, Math.min(endPage, totalPages));
  const indices = Array.from({ length: safeEnd - safeStart + 1 }, (_, i) => safeStart - 1 + i);

  const outDoc = await PDFDocument.create();
  const copiedPages = await outDoc.copyPages(sourceDoc, indices);
  copiedPages.forEach((page) => outDoc.addPage(page));

  const outBytes = await outDoc.save();
  const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
