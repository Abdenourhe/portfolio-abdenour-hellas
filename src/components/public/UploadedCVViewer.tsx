"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { FileText, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface UploadedCVViewerProps {
  cvUrl: string;
  fileName?: string;
}

const TABS = [
  { label: "Français", code: "fr" },
  { label: "English", code: "en" },
];
const A4_WIDTH = 794; // px at ~96dpi
const MAX_PAGE_WIDTH = 1100;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

export default function UploadedCVViewer({ cvUrl, fileName }: UploadedCVViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [baseWidth, setBaseWidth] = useState<number>(A4_WIDTH);
  const [zoom, setZoom] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setBaseWidth(Math.min(width, MAX_PAGE_WIDTH));
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const pageWidth = Math.round(baseWidth * zoom);

  const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
  const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
  const handleResetZoom = () => setZoom(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[1200px] mx-auto bg-card rounded-xl shadow-xl overflow-hidden border border-border"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-background/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText size={16} />
          <span className="truncate max-w-[120px] sm:max-w-sm">{fileName || "CV.pdf"}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language tabs */}
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            {TABS.map((tab, index) => {
              const isActive = activePage === index + 1;
              return (
                <button
                  key={tab.code}
                  type="button"
                  onClick={() => setActivePage(index + 1)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
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
              className="min-w-[3rem] px-1.5 py-1 text-xs font-medium rounded-md hover:bg-background transition-colors"
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
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08, rotate: -90 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleResetZoom}
            aria-label="Réinitialiser"
            className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Réinitialiser le zoom"
          >
            <RotateCcw size={16} />
          </motion.button>
        </div>
      </div>

      {/* Page viewer */}
      <div
        ref={containerRef}
        className="relative bg-muted/30 p-4 md:p-6 overflow-auto min-h-[500px] flex justify-center"
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
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
              >
                <Page
                  pageNumber={activePage}
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
              </Document>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
