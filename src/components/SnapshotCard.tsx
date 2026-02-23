import { forwardRef } from "react";

interface SnapshotCardProps {
  name: string;
  action: string;
  aiIkigai: string | null;
  isLoadingAi?: boolean;
  sessionId?: string | null;
}

function formatDate() {
  return new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const SnapshotCard = forwardRef<HTMLDivElement, SnapshotCardProps>(
  function SnapshotCard({ name, action, aiIkigai, isLoadingAi, sessionId }, ref) {
    return (
      <div
        ref={ref}
        data-snapshot-card
        className="w-full max-w-[500px] bg-white rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5"
      >
        {/* ── Header ── */}
        <div className="bg-matcha-dark relative overflow-hidden px-9 pt-10 pb-11">
          {/* Massive kanji watermark */}
          <div
            className="absolute right-0 bottom-0 font-display select-none pointer-events-none text-white"
            style={{ fontSize: "11rem", lineHeight: 0.85, opacity: 0.06 }}
            aria-hidden
          >
            生
          </div>
          {/* Thin accent rule */}
          <div className="w-7 h-[2px] bg-matcha-accent mb-7 rounded-full" />
          <h2 className="font-display text-[1.85rem] text-white font-semibold tracking-tight mb-2 leading-tight">
            {name || "Mi Ikigai"}
          </h2>
          <p className="text-[0.65rem] text-white/50 tracking-[0.22em] uppercase font-medium">
            {formatDate()} &nbsp;·&nbsp; Ikigai
          </p>
          {sessionId && (
            <p className="text-[0.6rem] text-white/30 tracking-[0.15em] uppercase font-mono mt-1.5">
              sesión #{sessionId.slice(0, 8)}
            </p>
          )}
        </div>

        {/* ── AI Ikigai quote ── */}
        <div className="px-9 pt-8 pb-6">
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-matcha-accent mb-5 font-semibold flex items-center gap-1.5">
            <span>✦</span> Tu resumen Ikigai
          </p>

          {isLoadingAi ? (
            <div className="space-y-2.5">
              <div className="h-3 bg-matcha-bg rounded-full w-full animate-pulse" />
              <div className="h-3 bg-matcha-bg rounded-full w-5/6 animate-pulse" />
              <div className="h-3 bg-matcha-bg rounded-full w-4/6 animate-pulse" />
              <p className="text-xs text-matcha-muted mt-3 animate-pulse">Generando tu resumen…</p>
            </div>
          ) : aiIkigai ? (
            <div className="relative">
              {/* Decorative opening quotation mark */}
              <span
                className="absolute -top-3 -left-1 text-matcha-accent font-display select-none pointer-events-none"
                style={{ fontSize: "3.5rem", opacity: 0.2, lineHeight: 1 }}
                aria-hidden
              >
                "
              </span>
              <p className="text-[1.05rem] text-matcha-dark leading-[1.8] font-display italic pl-3 tracking-wide">
                {aiIkigai}
              </p>
            </div>
          ) : (
            <p className="text-sm text-matcha-muted">—</p>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="mx-9 flex items-center gap-3 pb-6">
          <div className="flex-1 h-px bg-matcha-accent/20" />
          <span className="text-matcha-accent text-[0.6rem]">✦</span>
          <div className="flex-1 h-px bg-matcha-accent/20" />
        </div>

        {/* ── Action commitment ── */}
        <div className="px-9 pb-9">
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-matcha-accent mb-3 font-semibold flex items-center gap-1.5">
            <span>→</span> Mi acción
          </p>
          <div className="bg-matcha-bg rounded-2xl px-5 py-4">
            <p className="text-[0.9rem] text-matcha-dark font-medium leading-relaxed">
              {action || "—"}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default SnapshotCard;
