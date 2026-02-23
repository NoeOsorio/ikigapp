import { forwardRef } from "react";
import type { SnapshotPayload } from "../lib/nuqs";
import { CATEGORIES } from "../constants/categories";
import cherryblossomUrl from "../assets/best_svg_images/cherryblossom-svgrepo-com.svg";
import leafUrl from "../assets/best_svg_images/leaf-svgrepo-com.svg";
import leafMomijiUrl from "../assets/best_svg_images/leaf-momiji-svgrepo-com.svg";
import snowflakeUrl from "../assets/best_svg_images/snowflake-svgrepo-com.svg";

const SEASON_ICON_URLS = {
  spring: cherryblossomUrl,
  summer: leafUrl,
  autumn: leafMomijiUrl,
  winter: snowflakeUrl,
} as const;

interface SnapshotCardProps {
  payload: SnapshotPayload;
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const SnapshotCard = forwardRef<HTMLDivElement, SnapshotCardProps>(
  function SnapshotCard({ payload }, ref) {
    return (
      <div
        ref={ref}
        data-snapshot-card
        className="w-full max-w-[480px] bg-white rounded-[28px] overflow-hidden shadow-2xl border border-matcha-accent/15 font-body ring-1 ring-black/5"
      >
        <div className="bg-matcha-dark px-8 py-8 relative overflow-hidden">
          <div className="absolute right-5 top-1/2 -translate-y-1/2 font-serif text-6xl text-white/8 pointer-events-none select-none leading-none tracking-tighter">
            生き甲斐
          </div>
          <h2 className="font-display text-2xl text-white mb-1.5 relative font-semibold tracking-tight">
            {payload.name || "My Ikigai"}
          </h2>
          <p className="text-xs text-white/70 tracking-widest relative uppercase font-medium">
            {formatDate()} · Session
          </p>
        </div>
        <div className="px-8 py-8 space-y-6">
          {CATEGORIES.map((cat) => {
            const items = payload[`c${cat.step}` as keyof SnapshotPayload];
            const list = Array.isArray(items) ? items : [];
            return (
              <section key={cat.step} className="pb-6 border-b border-matcha-accent/10 last:border-0 last:pb-0">
                <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-3 flex items-center gap-1.5 font-semibold">
                  <img
                    src={SEASON_ICON_URLS[cat.season]}
                    alt=""
                    className="w-4 h-4 shrink-0"
                    aria-hidden
                  />
                  {cat.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.map((item, j) => (
                    <span
                      key={j}
                      className="rounded-full py-1.5 px-3.5 text-[0.8rem] bg-matcha-bg/60 text-matcha-dark font-medium border border-matcha-accent/15"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            );
          })}
          <section className="pt-2">
            <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-3 flex items-center gap-1.5 font-semibold">
              <span className="text-sm">✦</span> My Action Item
            </p>
            <div className="rounded-xl py-4 px-4 text-sm text-matcha-dark bg-matcha-bg/60 border-l-[3px] border-matcha-accent leading-relaxed font-medium">
              {payload.action || "—"}
            </div>
          </section>
        </div>
      </div>
    );
  }
);

export default SnapshotCard;
