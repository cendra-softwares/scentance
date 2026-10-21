"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  rise: number;
  sway: number;
  phase: number;
  alpha: number;
};

/**
 * Motes of light drifting upward like a scent leaving the skin.
 * Plain 2D canvas, and it only animates while on screen.
 */
export function ScentParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frame = 0;
    let particles: Particle[] = [];

    const spawn = (anywhere: boolean): Particle => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 12,
      radius: 0.5 + Math.random() * 1.5,
      rise: 0.12 + Math.random() * 0.42,
      sway: 6 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.2 + Math.random() * 0.55,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, Math.max(28, (width * height) / 9000)));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.rise;
        if (p.y < -12) Object.assign(p, spawn(false));

        const x = p.x + Math.sin(time * 0.0005 + p.phase) * p.sway;
        // Fade in from the bottom edge and dissolve toward the top
        const fade = clampUnit(Math.min(p.y / (height * 0.3), (height - p.y) / (height * 0.15)));
        const alpha = p.alpha * fade;

        ctx.fillStyle = `rgba(236, 231, 223, ${alpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(236, 231, 223, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    const sizing = new ResizeObserver(resize);

    resize();
    sizing.observe(canvas);
    visibility.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      sizing.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
