"use client";

import { useEffect, useRef } from "react";

export default function OscilloscopeWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let rafId: number;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = t * 0.0018;
      const midY = height / 2;

      // Oscilloscope grid
      ctx.strokeStyle = "rgba(30, 58, 95, 0.04)";
      ctx.lineWidth = 0.4;
      for (let y = 0; y < height; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const waves = [
        { amp: height * 0.22, freq: 0.008, speed: 1.2, phase: 0, color: "rgba(201, 169, 98, 0.7)", width: 1.4, glow: true },
        { amp: height * 0.14, freq: 0.012, speed: 1.8, phase: 2, color: "rgba(201, 169, 98, 0.25)", width: 0.9, glow: false },
        { amp: height * 0.08, freq: 0.006, speed: 0.9, phase: 4, color: "rgba(30, 58, 95, 0.08)", width: 0.7, glow: false },
      ];

      for (const wave of waves) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 1.5) {
          const y = midY + Math.sin(x * wave.freq + time * wave.speed + wave.phase) * wave.amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.width;
        if (wave.glow) {
          ctx.shadowColor = "rgba(201, 169, 98, 0.4)";
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Scan line (horizontal moving line)
      const scanX = ((t * 0.06) % (width + 100)) - 50;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.strokeStyle = "rgba(201, 169, 98, 0.06)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative w-full h-16 md:h-28 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
