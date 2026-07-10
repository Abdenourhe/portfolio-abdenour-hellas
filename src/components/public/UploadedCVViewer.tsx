"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { FileText, Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface UploadedCVViewerProps {
  cvUrl: string;
  fileName?: string;
}

const PAGE_LABELS = ["Version française", "English version"];
const A4_WIDTH = 794; // px at ~96dpi

export default function UploadedCVViewer({ cvUrl, fileName }: UploadedCVViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(A4_WIDTH);
  const [sideBySide, setSideBySide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const compute = (width: number) => {
      const available = width - 48; // padding
      const minSideBySide = A4_WIDTH * 0.55 * 2 + 32; // ~910px threshold
      if (available >= minSideBySide) {
        setSideBySide(true);
        setPageWidth(Math.min((available - 32) / 2, A4_WIDTH));
      } else {
        setSideBySide(false);
        setPageWidth(Math.min(available, A4_WIDTH));
      }
    };

    const obs = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      compute(cr.width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="w-full max-w-[1600px] mx-auto bg-card rounded-xl shadow-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText size={16} />
          <span className="truncate max-w-[200px] sm:max-w-sm">{fileName || "CV.pdf"}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {numPages > 0 ? `${numPages} pages` : ""}
        </span>
      </div>
      <div
        ref={containerRef}
        className="relative bg-muted/30 p-4 md:p-6 overflow-auto min-h-[500px]"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {error ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm text-center px-4 min-h-[400px]">
            Impossible d&apos;afficher l&apos;aperçu du CV.
          </div>
        ) : (
          <Document
            file={cvUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoading(false);
            }}
            onLoadError={() => {
              setError(true);
              setLoading(false);
            }}
            loading={null}
            className={`flex ${sideBySide ? "flex-row" : "flex-col"} items-start justify-center gap-6 md:gap-8`}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {PAGE_LABELS[i] || `Page ${i + 1}`}
                </span>
                <Page
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="shadow-md"
                  loading={
                    <div
                      className="bg-white animate-pulse rounded-sm"
                      style={{ width: pageWidth, height: pageWidth * 1.414 }}
                    />
                  }
                />
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
