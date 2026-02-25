import { forwardRef } from "react";
import type { Intersections } from "../models/participant.model";

interface SnapshotCardProps {
  name: string;
  action: string;
  aiIkigai: string | null;
  isLoadingAi?: boolean;
  sessionId?: string | null;
  /** New flow: show 4 intersections + ikigai + actions instead of aiIkigai + action */
  intersections?: Intersections | null;
  ikigai?: string | null;
  actions?: string[] | null;
}

function formatDate() {
  return new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const INTERSECTION_TITLES: { key: keyof Intersections; label: string }[] = [
  { key: "pasion", label: "Pasión" },
  { key: "mision", label: "Misión" },
  { key: "profesion", label: "Profesión" },
  { key: "vocacion", label: "Vocación" },
];

const SnapshotCard = forwardRef<HTMLDivElement, SnapshotCardProps>(
  function SnapshotCard(
    { name, action, aiIkigai, isLoadingAi, sessionId, intersections, ikigai, actions },
    ref
  ) {
    const useNewLayout =
      intersections != null &&
      (ikigai ?? "").trim() !== "" &&
      (actions?.length ?? 0) >= 1;

    return (
      <div
        ref={ref}
        data-snapshot-card
        className="w-full bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/5"
      >
        {/* ── Header ── */}
        <div className="bg-matcha-dark relative overflow-hidden px-5 sm:px-7 pt-8 pb-8">
          <div
            className="absolute right-0 bottom-0 font-display select-none pointer-events-none text-white"
            style={{ fontSize: "8rem", lineHeight: 0.85, opacity: 0.06 }}
            aria-hidden
          >
            生
          </div>
          <div className="w-7 h-[2px] bg-matcha-accent mb-4 rounded-full" />
          <h2 className="font-display text-[1.6rem] sm:text-[1.85rem] text-white font-semibold tracking-tight mb-2 leading-tight">
            {name || "Mi Ikigai"}
          </h2>
          <p className="text-[0.62rem] text-white/50 tracking-[0.22em] uppercase font-medium">
            {formatDate()} &nbsp;·&nbsp; Ikigai
          </p>
          {sessionId && (
            <p className="text-[0.58rem] text-white/30 tracking-[0.15em] uppercase font-mono mt-1.5">
              sesión #{sessionId.slice(0, 8)}
            </p>
          )}
        </div>

        {useNewLayout ? (
          <>
            {/* ── New: 4 intersections ── */}
            <div className="px-5 sm:px-7 pt-7 pb-4">
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-matcha-accent mb-5 font-semibold flex items-center gap-1.5">
                <span>✦</span> Las cuatro intersecciones
              </p>
              <div className="space-y-4">
                {INTERSECTION_TITLES.map(({ key, label }) => (
                  <div key={key} className="bg-matcha-bg/60 rounded-2xl px-4 py-3.5 border border-matcha-accent/10">
                    <p className="text-[0.6rem] tracking-wider uppercase text-matcha-muted font-semibold mb-1.5">
                      {label}
                    </p>
                    <p className="text-[0.95rem] sm:text-[1rem] text-matcha-dark leading-relaxed">
                      {intersections![key] || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-5 sm:mx-7 flex items-center gap-3 py-5">
              <div className="flex-1 h-px bg-matcha-accent/20" />
              <span className="text-matcha-accent text-[0.6rem]">✦</span>
              <div className="flex-1 h-px bg-matcha-accent/20" />
            </div>

            {/* ── New: Ikigai (user) ── */}
            <div className="px-5 sm:px-7 pb-4">
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-matcha-accent mb-3 font-semibold flex items-center gap-1.5">
                <span>✦</span> Mi Ikigai
              </p>
              <div className="bg-matcha-bg/40 rounded-2xl px-4 py-4 border border-matcha-accent/10">
                <p className="text-[1rem] sm:text-[1.1rem] text-matcha-dark leading-relaxed font-display italic">
                  {ikigai!.trim()}
                </p>
              </div>
            </div>

            <div className="mx-5 sm:mx-7 flex items-center gap-3 py-5">
              <div className="flex-1 h-px bg-matcha-accent/20" />
              <span className="text-matcha-accent text-[0.6rem]">✦</span>
              <div className="flex-1 h-px bg-matcha-accent/20" />
            </div>

            {/* ── New: Acciones concretas ── */}
            <div className="px-5 sm:px-7 pb-7">
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-matcha-accent mb-3 font-semibold flex items-center gap-1.5">
                <span>→</span> Acciones concretas
              </p>
              <div className="bg-matcha-bg/40 rounded-2xl px-4 py-4 border border-matcha-accent/10">
                <ul className="space-y-3">
                  {actions!.map((a, i) => (
                    <li key={i} className="text-[0.95rem] sm:text-[1rem] text-matcha-dark font-medium leading-relaxed flex gap-3">
                      <span className="text-matcha-accent shrink-0 mt-0.5">→</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ── Legacy: AI Ikigai quote ── */}
            <div className="px-5 sm:px-7 pt-7 pb-5">
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-matcha-accent mb-4 font-semibold flex items-center gap-1.5">
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
                <div className="bg-matcha-bg/40 rounded-2xl px-4 py-4 border border-matcha-accent/10 relative">
                  <span
                    className="absolute -top-3 -left-1 text-matcha-accent font-display select-none pointer-events-none"
                    style={{ fontSize: "3.5rem", opacity: 0.15, lineHeight: 1 }}
                    aria-hidden
                  >
                    "
                  </span>
                  <p className="text-[1rem] sm:text-[1.05rem] text-matcha-dark leading-[1.7] font-display italic pl-3">
                    {aiIkigai}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-matcha-muted">—</p>
              )}
            </div>

            <div className="mx-5 sm:mx-7 flex items-center gap-3 py-5">
              <div className="flex-1 h-px bg-matcha-accent/20" />
              <span className="text-matcha-accent text-[0.6rem]">✦</span>
              <div className="flex-1 h-px bg-matcha-accent/20" />
            </div>

            <div className="px-5 sm:px-7 pb-7">
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-matcha-accent mb-3 font-semibold flex items-center gap-1.5">
                <span>→</span> Mi acción
              </p>
              <div className="bg-matcha-bg/40 rounded-2xl px-4 py-4 border border-matcha-accent/10">
                <p className="text-[0.95rem] sm:text-[1rem] text-matcha-dark font-medium leading-relaxed">
                  {action || "—"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default SnapshotCard;
