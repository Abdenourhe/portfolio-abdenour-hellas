"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Density: ~1 node per 25 000 px²
    const nodeCount = Math.max(30, Math.min(100, Math.floor((width * height) / 25000)));
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const mouse = { x: -9999, y: -9999 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let rafId: number;
    const connectDist = 130;
    const mouseRadius = 160;

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const dark = isDark();
      const t = performance.now();

      const baseNode = dark ? "rgba(255,255,255,0.12)" : "rgba(30,58,95,0.12)";
      const baseLine = dark ? "rgba(255,255,255,0.06)" : "rgba(30,58,95,0.06)";
      const activeNode = "rgba(255,107,0,0.75)";
      const activeLine = "rgba(255,107,0,0.4)";
      const glowNode = "rgba(255,107,0,0.12)";

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.phase += 0.02;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const mx = (nodes[i].x + nodes[j].x) / 2;
            const my = (nodes[i].y + nodes[j].y) / 2;
            const mouseDist = Math.sqrt((mx - mouse.x) ** 2 + (my - mouse.y) ** 2);
            const active = mouseDist < mouseRadius;

            const opacity = 1 - dist / connectDist;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = active
              ? activeLine
              : dark
                ? `rgba(255,255,255,${opacity * 0.06})`
                : `rgba(30,58,95,${opacity * 0.06})`;
            ctx.lineWidth = active ? 1.4 : 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const mouseDist = Math.sqrt((node.x - mouse.x) ** 2 + (node.y - mouse.y) ** 2);
        const active = mouseDist < mouseRadius;
        const pulse = active ? 1 + Math.sin(t / 120 + node.phase) * 0.3 : 1;
        const r = node.radius * pulse;

        // Glow ring
        if (active) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 6, 0, Math.PI * 2);
          ctx.fillStyle = glowNode;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, active ? r * 1.4 : r, 0, Math.PI * 2);
        ctx.fillStyle = active ? activeNode : baseNode;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 select-none"
    />
  );
}
