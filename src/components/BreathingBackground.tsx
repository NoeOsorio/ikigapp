import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export default function BreathingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 300, // Purple to pink range
      });
    }

    let breathPhase = 0;

    const animate = () => {
      if (!canvas || !ctx) return;

      // Breathing cycle: 12 seconds (4s in, 4s hold, 4s out)
      breathPhase += 0.005;
      const breathCycle = Math.sin(breathPhase) * 0.5 + 0.5; // 0 to 1
      const breathScale = 1 + breathCycle * 0.08; // Scale between 1 and 1.08

      // Clear with gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * breathScale * 0.8
      );
      
      gradient.addColorStop(0, "#fdf4e8"); // Dawn bg (warm center)
      gradient.addColorStop(0.5, "#f5f6f8"); // Lobby bg (neutral middle)
      gradient.addColorStop(1, "#e8e9f0"); // Cooler edges

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        // Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle with breathing effect
        const particleScale = breathScale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * particleScale, 0, Math.PI * 2);
        
        // Color based on hue
        const alpha = p.opacity * (0.3 + breathCycle * 0.4);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha})`;
        ctx.fill();

        // Add glow
        ctx.shadowBlur = 10 * breathScale;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15 * breathCycle;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(232, 130, 154, ${opacity})`; // Spring accent color
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
