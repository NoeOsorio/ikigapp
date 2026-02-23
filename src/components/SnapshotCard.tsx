import { forwardRef } from "react";

interface SnapshotCardProps {
  name: string;
  action: string;
  aiIkigai: string | null;
  isLoadingAi?: boolean;
}

function formatDate() {
  return new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const SnapshotCard = forwardRef<HTMLDivElement, SnapshotCardProps>(
  function SnapshotCard({ name, action, aiIkigai, isLoadingAi }, ref) {
    return (
      <div
        ref={ref}
        data-snapshot-card
        className="w-full max-w-[480px] bg-white rounded-[28px] overflow-hidden shadow-2xl border border-matcha-accent/15 font-body ring-1 ring-black/5"
      >
        {/* Header */}
        <div className="bg-matcha-dark px-8 py-8 relative overflow-hidden">
          <div className="absolute right-5 top-1/2 -translate-y-1/2 font-serif text-6xl text-white/8 pointer-events-none select-none leading-none tracking-tighter">
            生き甲斐
          </div>
          <h2 className="font-display text-2xl text-white mb-1.5 relative font-semibold tracking-tight">
            {name || "Mi Ikigai"}
          </h2>
          <p className="text-xs text-white/70 tracking-widest relative uppercase font-medium">
            {formatDate()} · Sesión
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">
          {/* AI Ikigai summary */}
          <section className="pb-6 border-b border-matcha-accent/10">
            <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-3 flex items-center gap-1.5 font-semibold">
              <span className="text-sm">✦</span> Tu resumen Ikigai
            </p>
            {isLoadingAi ? (
              <div className="rounded-xl py-4 px-4 bg-matcha-bg/60 border-l-[3px] border-matcha-accent/40">
                <p className="text-sm text-matcha-muted animate-pulse">Generando tu resumen…</p>
              </div>
            ) : aiIkigai ? (
              <div className="rounded-xl py-4 px-4 bg-matcha-bg/60 border-l-[3px] border-matcha-accent leading-relaxed">
                <p className="text-sm text-matcha-dark font-medium italic">{aiIkigai}</p>
              </div>
            ) : (
              <div className="rounded-xl py-4 px-4 bg-matcha-bg/60 border-l-[3px] border-matcha-accent/40">
                <p className="text-sm text-matcha-muted">—</p>
              </div>
            )}
          </section>

          {/* Action commitment */}
          <section className="pt-2">
            <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-3 flex items-center gap-1.5 font-semibold">
              <span className="text-sm">→</span> Mi acción
            </p>
            <div className="rounded-xl py-4 px-4 text-sm text-matcha-dark bg-matcha-bg/60 border-l-[3px] border-matcha-accent leading-relaxed font-medium">
              {action || "—"}
            </div>
          </section>
        </div>
      </div>
    );
  }
);

export default SnapshotCard;
