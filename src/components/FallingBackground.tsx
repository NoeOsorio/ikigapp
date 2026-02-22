import { useEffect, useRef } from "react";
import type { Season } from "../constants/categories";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const SEASON_COLORS: Record<Season, string> = {
  spring: "rgba(255, 182, 193, 0.6)",
  summer: "rgba(255, 255, 200, 0.5)",
  autumn: "rgba(205, 92, 92, 0.5)",
  winter: "rgba(230, 240, 255, 0.7)",
};

export default function FallingBackground({ season }: { season: Season }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const count = 40;
    function initParticles() {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * (canvas?.width ?? 800),
        y: Math.random() * (canvas?.height ?? 600),
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.3 + Math.random() * 0.5,
        size: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.5,
      }));
    }

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const color = SEASON_COLORS[season];

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h) {
          p.y = 0;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [season]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
