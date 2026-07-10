"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { FileText, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface UploadedCVViewerProps {
  cvUrl: string;
  fileName?: string;
}

const PAGE_LABELS = ["Version française", "English version"];
const A4_WIDTH = 794; // px at ~96dpi
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

export default function UploadedCVViewer({ cvUrl, fileName }: UploadedCVViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [baseWidth, setBaseWidth] = useState<number>(A4_WIDTH);
  const [zoom, setZoom] = useState<number>(1);
  const [sideBySide, setSideBySide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const computeLayout = (containerWidth: number, currentZoom: number, pages: number) => {
    const available = containerWidth - 48; // padding
    const minSideBySide = A4_WIDTH * 0.55 * 2 + 32; // ~910px threshold
    const targetBaseWidth = available >= minSideBySide
      ? Math.min((available - 32) / 2, A4_WIDTH)
      : Math.min(available, A4_WIDTH);

    const displayWidth = Math.round(targetBaseWidth * currentZoom);
    const fitsSideBySide = pages > 1 && available >= displayWidth * pages + 32 * (pages - 1);

    setBaseWidth(targetBaseWidth);
    setSideBySide(fitsSideBySide);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      computeLayout(entries[0].contentRect.width, zoom, numPages);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [zoom, numPages]);

  useEffect(() => {
    if (containerRef.current) {
      computeLayout(containerRef.current.clientWidth, zoom, numPages);
    }
  }, [zoom, numPages]);

  const pageWidth = Math.round(baseWidth * zoom);

  const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
  const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
  const handleResetZoom = () => setZoom(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[1600px] mx-auto bg-card rounded-xl shadow-xl overflow-hidden border border-border"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-background/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText size={16} />
          <span className="truncate max-w-[150px] sm:max-w-sm">{fileName || "CV.pdf"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {numPages > 0 ? `${numPages} pages` : ""}
          </span>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1 bg-muted rounded-lg p-1"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom arrière"
              className="p-1.5 rounded-md hover:bg-background disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ZoomOut size={16} />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleResetZoom}
              className="min-w-[3.5rem] px-2 py-1 text-xs font-medium rounded-md hover:bg-background transition-colors"
              title="Réinitialiser le zoom"
            >
              {Math.round(zoom * 100)}%
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom avant"
              className="p-1.5 rounded-md hover:bg-background disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ZoomIn size={16} />
            </motion.button>
          </motion.div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, rotate: -90 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleResetZoom}
            aria-label="Réinitialiser"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Réinitialiser le zoom"
          >
            <RotateCcw size={16} />
          </motion.button>
        </div>
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
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
              </motion.div>
            ))}
          </Document>
        )}
      </div>
    </motion.div>
  );
}
