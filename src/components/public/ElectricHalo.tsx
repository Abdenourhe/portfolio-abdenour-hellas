"use client";

interface ElectricHaloProps {
  className?: string;
}

export default function ElectricHalo({ className = "" }: ElectricHaloProps) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
      {/* Rotating conic gradient */}
      <div
        className="absolute rounded-full electric-halo-spin"
        style={{
          width: "112%",
          height: "112%",
          background: "conic-gradient(from 0deg, transparent 0%, rgba(201,169,98,0.25) 15%, transparent 30%, rgba(201,169,98,0.18) 50%, transparent 65%, rgba(201,169,98,0.12) 80%, transparent 100%)",
          maskImage: "radial-gradient(transparent 60%, black 62%)",
          WebkitMaskImage: "radial-gradient(transparent 60%, black 62%)",
        }}
      />
      {/* Pulsing ring */}
      <div
        className="absolute rounded-full border-2 border-secondary/25 electric-halo-pulse"
        style={{ width: "108%", height: "108%" }}
      />
      {/* Second slower ring */}
      <div
        className="absolute rounded-full border border-secondary/25 electric-halo-pulse-slow"
        style={{ width: "118%", height: "118%" }}
      />
    </div>
  );
}
