import { forwardRef } from "react";
import type { SnapshotPayload } from "../lib/nuqs";
import { CATEGORIES } from "../constants/categories";

interface SnapshotCardProps {
  payload: SnapshotPayload;
}

const SnapshotCard = forwardRef<HTMLDivElement, SnapshotCardProps>(
  function SnapshotCard({ payload }, ref) {
    return (
      <div
        ref={ref}
        className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-lg p-6 max-w-md w-full shadow-lg"
        style={{
          color: "var(--color-ink)",
          fontFamily: "var(--font-body)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          {payload.name || "My Ikigai"}
        </h2>
        <div className="space-y-4 text-sm">
          {CATEGORIES.map((cat, i) => {
            const items = payload[`c${cat.step}` as keyof SnapshotPayload];
            const list = Array.isArray(items) ? items : [];
            return (
              <div key={cat.step}>
                <p className="font-medium opacity-90 mb-1">
                  {cat.emoji} {cat.title}
                </p>
                <ul className="list-disc list-inside text-[var(--color-ink-muted)]">
                  {list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div>
            <p className="font-medium opacity-90 mb-1">Action item</p>
            <p className="text-[var(--color-ink-muted)]">{payload.action || "—"}</p>
          </div>
        </div>
      </div>
    );
  }
);

export default SnapshotCard;
