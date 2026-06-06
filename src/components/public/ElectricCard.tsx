"use client";

import { ReactNode } from "react";

interface ElectricCardProps {
  children: ReactNode;
  className?: string;
  rx?: number; // SVG rx relative to 100x100 viewBox
}

export default function ElectricCard({ children, className = "", rx = 3 }: ElectricCardProps) {
  const dashArray = "8 6 2 6";
  return (
    <div className={`group/card relative ${className}`}>
      {/* Electric circuit border — drawn on top */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          rx={rx}
          ry={rx}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray={dashArray}
          vectorEffect="non-scaling-stroke"
          className="text-border group-hover:text-secondary transition-colors duration-500"
          style={{
            strokeDashoffset: 0,
            animation: "electricPulse 3s linear infinite",
            opacity: 0.85,
          }}
        />
        {/* Glow overlay on hover */}
        <rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          rx={rx}
          ry={rx}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray={dashArray}
          vectorEffect="non-scaling-stroke"
          className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            filter: "drop-shadow(0 0 3px currentColor)",
            animation: "electricPulse 1.5s linear infinite",
          }}
        />
      </svg>
      {children}
    </div>
  );
}
