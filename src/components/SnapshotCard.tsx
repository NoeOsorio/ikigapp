import { forwardRef } from "react";
import type { SnapshotPayload } from "../lib/nuqs";
import { CATEGORIES } from "../constants/categories";

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
        className="w-full max-w-[480px] bg-white rounded-[28px] overflow-hidden shadow-xl border border-spring-accent/10 font-body"
      >
        <div className="bg-spring-dark px-8 py-7 relative overflow-hidden">
          <div className="absolute right-5 top-1/2 -translate-y-1/2 font-serif text-5xl text-white/10 pointer-events-none select-none leading-none">
            生き甲斐
          </div>
          <h2 className="font-display text-xl text-white mb-1 relative">
            {payload.name || "My Ikigai"}
          </h2>
          <p className="text-xs text-white/60 tracking-widest relative">
            {formatDate()} · Session
          </p>
        </div>
        <div className="px-8 py-7 space-y-5">
          {CATEGORIES.map((cat) => {
            const items = payload[`c${cat.step}` as keyof SnapshotPayload];
            const list = Array.isArray(items) ? items : [];
            return (
              <section key={cat.step} className="pb-5 border-b border-spring-accent/10 last:border-0 last:pb-0">
                <p className="text-[0.65rem] tracking-[0.12em] uppercase text-spring-accent mb-2 flex items-center gap-1.5 font-medium">
                  {cat.emoji} {cat.title}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {list.map((item, j) => (
                    <span
                      key={j}
                      className="rounded-full py-1 px-3 text-[0.78rem] bg-spring-bg text-spring-dark"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            );
          })}
          <section className="pt-1">
            <p className="text-[0.65rem] tracking-[0.12em] uppercase text-spring-accent mb-2 flex items-center gap-1.5 font-medium">
              ✦ My Action Item
            </p>
            <div className="rounded-xl py-3.5 px-4 text-sm text-spring-dark bg-spring-bg border-l-4 border-spring-accent leading-relaxed">
              {payload.action || "—"}
            </div>
          </section>
        </div>
      </div>
    );
  }
);

export default SnapshotCard;
