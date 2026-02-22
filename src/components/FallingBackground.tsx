import { useEffect, useRef } from "react";
import type { Season } from "../constants/categories";
import cherryblossomUrl from "../assets/best_svg_images/cherryblossom-svgrepo-com.svg";
import leafUrl from "../assets/best_svg_images/leaf-svgrepo-com.svg";
import leafMomijiUrl from "../assets/best_svg_images/leaf-momiji-svgrepo-com.svg";
import snowflakeUrl from "../assets/best_svg_images/snowflake-svgrepo-com.svg";

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

const SEASON_IMAGE_URLS: Record<Season, string> = {
  spring: cherryblossomUrl,
  summer: leafUrl,
  autumn: leafMomijiUrl,
  winter: snowflakeUrl,
};

function drawImageShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  img: HTMLImageElement
) {
  if (!img.complete) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

const SEASON_CONFIG: Record<
  Season,
  {
    count: number;
    speed: { min: number; max: number };
    size: { min: number; max: number };
    sway: number;
  }
> = {
  spring: {
    count: 35,
    speed: { min: 1, max: 2.5 },
    size: { min: 8, max: 18 },
    sway: 1.5,
  },
  summer: {
    count: 25,
    speed: { min: 0.5, max: 1.5 },
    size: { min: 10, max: 20 },
    sway: 0.8,
  },
  autumn: {
    count: 40,
    speed: { min: 1.5, max: 3 },
    size: { min: 12, max: 22 },
    sway: 2,
  },
  winter: {
    count: 60,
    speed: { min: 0.8, max: 2 },
    size: { min: 8, max: 20 },
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
  const frameRef = useRef<number | undefined>(undefined);
  const imagesRef = useRef<Record<Season, HTMLImageElement | null>>({
    spring: null,
    summer: null,
    autumn: null,
    winter: null,
  });

  useEffect(() => {
    const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
    seasons.forEach((s) => {
      const img = new Image();
      img.src = SEASON_IMAGE_URLS[s];
      img.onload = () => {
        imagesRef.current[s] = img;
      };
    });
  }, []);

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

      const currentImg = imagesRef.current[season];
      particlesRef.current.forEach((p, i) => {
        p.y += p.speed;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * p.swayAmp;
        p.rotation += p.rotSpeed;

        if (currentImg?.complete) {
          drawImageShape(ctx, p.x, p.y, p.size, p.rotation, p.alpha, currentImg);
        }

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
