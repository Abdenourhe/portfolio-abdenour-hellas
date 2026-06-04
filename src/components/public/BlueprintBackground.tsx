"use client";

import { useRef, useEffect } from "react";

export default function BlueprintBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Subtle parallax on scroll: shift the grid slightly
    const handleScroll = () => {
      if (!svgRef.current) return;
      const y = window.scrollY * 0.02;
      svgRef.current.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const gridColor = "currentColor";
  const spacing = 80;
  const width = 2000;
  const height = 3000;
  const linesH = Math.ceil(height / spacing);
  const linesV = Math.ceil(width / spacing);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden text-primary/[0.035] dark:text-primary/[0.06] select-none"
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="absolute top-0 left-1/2 -translate-x-1/2 will-change-transform"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="blueprint-grid" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
            {/* Horizontal */}
            <path d={`M0 ${spacing / 2} L${spacing} ${spacing / 2}`} stroke={gridColor} strokeWidth="0.5" strokeDasharray="2 4" />
            {/* Vertical */}
            <path d={`M${spacing / 2} 0 L${spacing / 2} ${spacing}`} stroke={gridColor} strokeWidth="0.5" strokeDasharray="2 4" />
            {/* Diagonal / */}
            <path d={`M0 ${spacing} L${spacing} 0`} stroke={gridColor} strokeWidth="0.5" strokeDasharray="1 6" opacity="0.5" />
          </pattern>
        </defs>

        {/* Base grid */}
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

        {/* Construction lines that draw slowly */}
        <g className="blueprint-draw">
          {Array.from({ length: linesH }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * spacing}
              x2={width}
              y2={i * spacing}
              stroke={gridColor}
              strokeWidth="0.5"
              strokeDasharray="1200"
              strokeDashoffset="1200"
              opacity="0.6"
              style={{
                animation: `blueprintDraw 12s ease-in-out ${i * 0.3}s infinite alternate`,
              }}
            />
          ))}
          {Array.from({ length: linesV }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * spacing}
              y1={0}
              x2={i * spacing}
              y2={height}
              stroke={gridColor}
              strokeWidth="0.5"
              strokeDasharray="1200"
              strokeDashoffset="1200"
              opacity="0.6"
              style={{
                animation: `blueprintDraw 12s ease-in-out ${i * 0.3 + 6}s infinite alternate`,
              }}
            />
          ))}
        </g>

        {/* Corner markers (crosshairs) */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const cx = col * spacing * 3 + spacing;
            const cy = row * spacing * 3 + spacing;
            return (
              <g key={`cross-${row}-${col}`} opacity="0.4">
                <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke={gridColor} strokeWidth="0.5" />
                <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke={gridColor} strokeWidth="0.5" />
                <circle cx={cx} cy={cy} r="2" fill="none" stroke={gridColor} strokeWidth="0.5" strokeDasharray="1 2" />
              </g>
            );
          })
        )}
      </svg>

      <style jsx global>{`
        @keyframes blueprintDraw {
          0% {
            stroke-dashoffset: 1200;
          }
          40% {
            stroke-dashoffset: 0;
          }
          60% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -1200;
          }
        }
      `}</style>
    </div>
  );
}
