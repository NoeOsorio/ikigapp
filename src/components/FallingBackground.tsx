import { useEffect, useRef } from "react";
import type { Season } from "../constants/categories";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotSpeed: number;
  sway: number;
  swaySpeed: number;
  swayAmp: number;
  alpha: number;
  season: Season;
}

type DrawShape = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  colorFn: () => string
) => void;

function drawSakura(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  colorFn: () => string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  const petalColor = colorFn() + "1)";
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 5);
    ctx.fillStyle = petalColor;
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.4, size * 0.22, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = `hsla(340, 65%, 72%, ${alpha * 0.7})`;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  colorFn: () => string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colorFn() + "0.9)";
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.3, size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colorFn() + "0.4)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.6);
  ctx.lineTo(0, size * 0.6);
  ctx.stroke();
  ctx.restore();
}

function drawMomiji(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  colorFn: () => string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colorFn() + "0.9)";
  const lobes = 7;
  ctx.beginPath();
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? size * 0.5 : size * 0.25;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSnow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  colorFn: () => string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = colorFn() + "1)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    ctx.moveTo(0, -size * 0.6);
    ctx.lineTo(-size * 0.3, -size * 0.35);
    ctx.moveTo(0, -size * 0.6);
    ctx.lineTo(size * 0.3, -size * 0.35);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

const SEASON_CONFIG: Record<
  Season,
  {
    color: () => string;
    shape: DrawShape;
    count: number;
    speed: { min: number; max: number };
    size: { min: number; max: number };
    sway: number;
  }
> = {
  spring: {
    color: () =>
      `hsla(${340 + Math.random() * 20}, 75%, ${58 + Math.random() * 18}%, `,
    shape: drawSakura,
    count: 35,
    speed: { min: 1, max: 2.5 },
    size: { min: 8, max: 18 },
    sway: 1.5,
  },
  summer: {
    color: () =>
      `hsla(${110 + Math.random() * 40}, 55%, ${42 + Math.random() * 18}%, `,
    shape: drawLeaf,
    count: 25,
    speed: { min: 0.5, max: 1.5 },
    size: { min: 10, max: 20 },
    sway: 0.8,
  },
  autumn: {
    color: () =>
      `hsla(${15 + Math.random() * 30}, 70%, ${45 + Math.random() * 18}%, `,
    shape: drawMomiji,
    count: 40,
    speed: { min: 1.5, max: 3 },
    size: { min: 12, max: 22 },
    sway: 2,
  },
  winter: {
    color: () => `hsla(210, 45%, ${68 + Math.random() * 18}%, `,
    shape: drawSnow,
    count: 60,
    speed: { min: 0.8, max: 2 },
    size: { min: 3, max: 10 },
    sway: 0.5,
  },
};

function createParticle(
  canvas: HTMLCanvasElement,
  config: (typeof SEASON_CONFIG)[Season],
  season: Season
): Particle {
  return {
    x: Math.random() * canvas.width,
    y: -30,
    size: config.size.min + Math.random() * (config.size.max - config.size.min),
    speed: config.speed.min + Math.random() * (config.speed.max - config.speed.min),
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.02 + 0.005,
    swayAmp: config.sway * (0.5 + Math.random()),
    alpha: 0.4 + Math.random() * 0.5,
    season,
  };
}

export default function FallingBackground({ season }: { season: Season }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = SEASON_CONFIG[season];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = [];
      for (let i = 0; i < config.count; i++) {
        const p = createParticle(canvas, config, season);
        p.y = Math.random() * canvas.height;
        particlesRef.current.push(p);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p, i) => {
        p.y += p.speed;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * p.swayAmp;
        p.rotation += p.rotSpeed;

        config.shape(ctx, p.x, p.y, p.size, p.rotation, p.alpha, config.color);

        if (p.y > h + 30) {
          particlesRef.current[i] = createParticle(canvas, config, season);
        }
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden
    />
  );
}
