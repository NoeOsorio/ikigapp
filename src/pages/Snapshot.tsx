import { useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser, type SnapshotPayload } from "../lib/nuqs";
import { getSnapshotLinkKey } from "../lib/snapshotStorage";
import { saveShareLink } from "../services/participants.service";
import { nameToParticipantId, participantDisplayName } from "../models/participant.model";
import { getUserIdentity } from "../lib/userIdentity";
import { useParticipants } from "../hooks/useParticipants";
import { workshopUrl } from "../lib/routes";
import SnapshotCard from "../components/SnapshotCard";

interface SnapshotProps {
  payload: SnapshotPayload;
}

export default function Snapshot({ payload }: SnapshotProps) {
  const navigate = useNavigate();
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const { data: participants = [] } = useParticipants(session);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get the actual logged-in user's identity from sessionStorage
  const userIdentity = getUserIdentity();
  const myParticipantId = userIdentity?.participantId ?? (name ? nameToParticipantId(name) : null);
  
  // Find my participant data to get the actual name for navigation
  const myParticipant = participants.find((p) => p.id === myParticipantId);
  const myActualName = myParticipant ? participantDisplayName(myParticipant) : name;

  const handleBackToLobby = useCallback(() => {
    // Navigate back to lobby using the actual logged-in user's name
    navigate(workshopUrl(session ?? "", myActualName ?? "", "lobby"));
  }, [navigate, session, myActualName]);

  useEffect(() => {
    if (typeof window !== "undefined" && session && name) {
      const link = window.location.href;
      try {
        sessionStorage.setItem(getSnapshotLinkKey(session, name), link);
      } catch {
        // ignore
      }
      saveShareLink(session, nameToParticipantId(name), link).catch(() => {});
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
          
          // Matcha color palette in hex (mirrors CSS custom properties for html2canvas)
          const c = "#1e2a1a", bg = "#e2ebe0", ac = "#6b8c5e", mu = "#4d6344";
          const bgMap: Record<string, string> = {
            "bg-matcha-dark": c,
            "bg-matcha-bg/60": "rgba(226, 235, 224, 0.6)",
            "bg-matcha-bg": bg,
            "bg-matcha-accent": ac,
            "bg-white": "#ffffff",
          };
          const textMap: Record<string, string> = {
            "text-matcha-dark": c,
            "text-matcha-accent": ac,
            "text-matcha-muted": mu,
            "text-white/70": "rgba(255, 255, 255, 0.7)",
            "text-white/8": "rgba(255, 255, 255, 0.08)",
            "text-white": "#ffffff",
          };
          const borderMap: Record<string, string> = {
            "border-matcha-accent/15": "rgba(107, 140, 94, 0.15)",
            "border-matcha-accent/10": "rgba(107, 140, 94, 0.1)",
            "border-matcha-accent": ac,
          };

          // Force matcha color classes to inline hex so html2canvas resolves CSS vars
          const replaceColors = (element: HTMLElement) => {
            const elements = [element, ...Array.from(element.querySelectorAll<HTMLElement>("*"))];
            for (const htmlEl of elements) {
              for (const cls of htmlEl.classList) {
                if (cls in bgMap) htmlEl.style.backgroundColor = bgMap[cls];
                if (cls in textMap) htmlEl.style.color = textMap[cls];
                if (cls in borderMap) htmlEl.style.borderColor = borderMap[cls];
                if (cls === "ring-black/5") htmlEl.style.boxShadow = "0 0 0 1px rgba(0, 0, 0, 0.05)";
              }
            }
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
      alert("No se pudo descargar la imagen. Intenta de nuevo.");
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
          ⬇ Descargar imagen
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-matcha-dark font-display text-sm border-[1.5px] border-matcha-accent/20 flex items-center justify-center gap-1.5 hover:border-matcha-accent hover:text-matcha-accent transition-colors hover:-translate-y-0.5 active:translate-y-0"
        >
          🔗 Copiar enlace para compartir
        </button>
        <button
          type="button"
          onClick={handleBackToLobby}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-matcha-dark font-display text-sm border-[1.5px] border-matcha-accent/20 flex items-center justify-center gap-1.5 hover:border-matcha-accent hover:text-matcha-accent transition-colors hover:-translate-y-0.5 active:translate-y-0"
        >
          Volver al lobby
        </button>
      </div>
    </div>
  );
}
