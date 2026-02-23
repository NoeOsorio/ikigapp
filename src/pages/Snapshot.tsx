import { useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser, type SnapshotPayload } from "../lib/nuqs";
import { getSnapshotLinkKey } from "../lib/snapshotStorage";
import { workshopUrl } from "../lib/routes";
import SnapshotCard from "../components/SnapshotCard";

interface SnapshotProps {
  payload: SnapshotPayload;
}

export default function Snapshot({ payload }: SnapshotProps) {
  const navigate = useNavigate();
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBackToLobby = useCallback(() => {
    navigate(workshopUrl(session ?? "", name ?? "", "lobby"));
  }, [navigate, session, name]);

  useEffect(() => {
    if (typeof window !== "undefined" && session && name) {
      try {
        sessionStorage.setItem(getSnapshotLinkKey(session, name), window.location.href);
      } catch {
        // ignore
      }
    }
  }, [session, name]);

  const handleDownload = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;
    
    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#e2ebe0",
        logging: false,
        allowTaint: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-snapshot-card]') as HTMLElement;
          if (!clonedCard) return;
          
          // Matcha color palette in hex
          const colors = {
            bg: "#e2ebe0",
            bgOpacity60: "rgba(226, 235, 224, 0.6)",
            accent: "#6b8c5e",
            accentOpacity15: "rgba(107, 140, 94, 0.15)",
            accentOpacity10: "rgba(107, 140, 94, 0.1)",
            dark: "#1e2a1a",
            muted: "#4d6344",
            white: "#ffffff",
            whiteOpacity8: "rgba(255, 255, 255, 0.08)",
            whiteOpacity70: "rgba(255, 255, 255, 0.7)",
          };
          
          // Force all matcha color classes to use inline hex values
          const replaceColors = (element: HTMLElement) => {
            // Get all elements including the root
            const elements = [element, ...Array.from(element.querySelectorAll("*"))];
            
            elements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              const classList = Array.from(htmlEl.classList);
              
              // Background colors
              if (classList.some(c => c.includes("bg-matcha-dark"))) {
                htmlEl.style.backgroundColor = colors.dark;
              }
              if (classList.some(c => c.includes("bg-matcha-bg/60"))) {
                htmlEl.style.backgroundColor = colors.bgOpacity60;
              }
              if (classList.some(c => c.includes("bg-matcha-bg"))) {
                htmlEl.style.backgroundColor = colors.bg;
              }
              if (classList.some(c => c.includes("bg-matcha-accent"))) {
                htmlEl.style.backgroundColor = colors.accent;
              }
              if (classList.some(c => c.includes("bg-white"))) {
                htmlEl.style.backgroundColor = colors.white;
              }
              
              // Text colors
              if (classList.some(c => c.includes("text-matcha-dark"))) {
                htmlEl.style.color = colors.dark;
              }
              if (classList.some(c => c.includes("text-matcha-accent"))) {
                htmlEl.style.color = colors.accent;
              }
              if (classList.some(c => c.includes("text-matcha-muted"))) {
                htmlEl.style.color = colors.muted;
              }
              if (classList.some(c => c.includes("text-white/70"))) {
                htmlEl.style.color = colors.whiteOpacity70;
              }
              if (classList.some(c => c.includes("text-white/8"))) {
                htmlEl.style.color = colors.whiteOpacity8;
              }
              if (classList.some(c => c.includes("text-white"))) {
                htmlEl.style.color = colors.white;
              }
              
              // Border colors
              if (classList.some(c => c.includes("border-matcha-accent/15"))) {
                htmlEl.style.borderColor = colors.accentOpacity15;
              }
              if (classList.some(c => c.includes("border-matcha-accent/10"))) {
                htmlEl.style.borderColor = colors.accentOpacity10;
              }
              if (classList.some(c => c.includes("border-matcha-accent"))) {
                htmlEl.style.borderColor = colors.accent;
              }
              
              // Ring colors (for the outer ring)
              if (classList.some(c => c.includes("ring-black/5"))) {
                htmlEl.style.boxShadow = "0 0 0 1px rgba(0, 0, 0, 0.05)";
              }
            });
          };
          
          replaceColors(clonedCard);
        },
      });
      
      const link = document.createElement("a");
      const filename = payload.name 
        ? `ikigai-${payload.name.replace(/\s+/g, "-")}.png`
        : "ikigai-snapshot.png";
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Download error:", e);
      alert("Failed to download image. Please try again.");
    }
  }, [payload.name]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8 px-4 relative">
      {/* Subtle radial gradient overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--color-matcha-accent)_0%,transparent_50%)] opacity-[0.08]" />
      
      <div className="animate-fade-up relative z-10">
        <SnapshotCard ref={cardRef} payload={payload} />
      </div>
      <div className="flex flex-wrap gap-3 justify-center animate-[fade-up_0.8s_ease_0.2s_both] relative z-10">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-matcha-dark text-white font-display text-sm flex items-center justify-center gap-1.5 hover:bg-matcha-accent transition-colors shadow-lg hover:shadow-matcha-accent/25 hover:-translate-y-0.5 active:translate-y-0"
        >
          ⬇ Download Image
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-matcha-dark font-display text-sm border-[1.5px] border-matcha-accent/20 flex items-center justify-center gap-1.5 hover:border-matcha-accent hover:text-matcha-accent transition-colors hover:-translate-y-0.5 active:translate-y-0"
        >
          🔗 Copy Share Link
        </button>
        <button
          type="button"
          onClick={handleBackToLobby}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-matcha-dark font-display text-sm border-[1.5px] border-matcha-accent/20 flex items-center justify-center gap-1.5 hover:border-matcha-accent hover:text-matcha-accent transition-colors hover:-translate-y-0.5 active:translate-y-0"
        >
          Back to lobby
        </button>
      </div>
    </div>
  );
}
