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

export default function UploadedCVViewer({ cvUrl, fileName }: UploadedCVViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(794);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(Math.min(width - 48, 794)); // 48 = padding (24px each side)
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="w-full max-w-[220mm] mx-auto bg-card rounded-xl shadow-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText size={16} />
          <span className="truncate max-w-[200px] sm:max-w-sm">{fileName || "CV.pdf"}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {numPages > 0 ? `${numPages} page${numPages > 1 ? "s" : ""}` : ""}
        </span>
      </div>
      <div
        ref={containerRef}
        className="relative bg-muted/30 p-4 md:p-6 overflow-auto max-h-[80vh] min-h-[500px]"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {error ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm text-center px-4">
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
            className="flex flex-col items-center gap-4 md:gap-6"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={containerWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="shadow-md"
                loading={
                  <div
                    className="bg-white animate-pulse rounded-sm"
                    style={{ width: containerWidth, height: containerWidth * 1.414 }}
                  />
                }
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
