import { useEffect, useState } from "react";
import {
  getSessionsCount,
  getAllParticipants,
  getAggregatedStats,
  type AggregatedStats,
} from "../services/analytics.service";
import { CATEGORIES } from "../constants/categories";

const QUADRANT_KEYS = ["c1", "c2", "c3", "c4"] as const;

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AggregatedStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getSessionsCount(), getAllParticipants()])
      .then(([sessionsCount, participants]) => {
        if (cancelled) return;
        setStats(getAggregatedStats(sessionsCount, participants));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load analytics");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <p className="text-matcha-muted text-sm animate-pulse">Loading analytics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <p className="text-matcha-muted text-sm">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const maxAvg =
    Math.max(
      stats.avgPerQuadrant.c1,
      stats.avgPerQuadrant.c2,
      stats.avgPerQuadrant.c3,
      stats.avgPerQuadrant.c4
    ) || 1;
  const quadrantBars = QUADRANT_KEYS.map((key, i) => ({
    key,
    label: CATEGORIES[i]?.shortName ?? key,
    emoji: CATEGORIES[i]?.emoji ?? "",
    avg: stats.avgPerQuadrant[key],
    widthPercent: (stats.avgPerQuadrant[key] / maxAvg) * 100,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-display text-2xl text-matcha-dark font-semibold tracking-tight mb-1">
          Analytics
        </h1>
        <p className="text-matcha-muted text-sm">Insights from completed Ikigai sessions</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* 1. Overview */}
        <section className="rounded-xl border border-matcha-accent/15 bg-matcha-bg/40 px-6 py-5">
          <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-4 font-semibold">
            Overview
          </p>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-2xl font-semibold text-matcha-dark tabular-nums">
                {stats.totalSessions}
              </p>
              <p className="text-matcha-muted text-xs mt-0.5">Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-matcha-dark tabular-nums">
                {stats.totalParticipants}
              </p>
              <p className="text-matcha-muted text-xs mt-0.5">Participants</p>
            </div>
          </div>
        </section>

        {/* 2. Completion rate */}
        <section className="rounded-xl border border-matcha-accent/15 bg-matcha-bg/40 px-6 py-5">
          <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-2 font-semibold">
            Completion rate
          </p>
          <p className="text-matcha-muted text-xs mb-3">
            Reached snapshot: {stats.finishedCount} of {stats.totalParticipants}
          </p>
          <div className="h-2.5 rounded-full bg-matcha-accent/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-matcha-accent transition-[width] duration-500"
              style={{ width: `${stats.completionRatePercent}%` }}
            />
          </div>
          <p className="text-lg font-semibold text-matcha-dark mt-2 tabular-nums">
            {stats.completionRatePercent.toFixed(1)}%
          </p>
        </section>

        {/* 3. Average items per quadrant */}
        <section className="sm:col-span-2 rounded-xl border border-matcha-accent/15 bg-matcha-bg/40 px-6 py-5">
          <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-4 font-semibold">
            Average items per quadrant
          </p>
          <div className="space-y-4">
            {quadrantBars.map(({ key, label, emoji, avg, widthPercent }) => (
              <div key={key} className="flex items-center gap-4">
                <span className="w-24 text-sm text-matcha-dark shrink-0 flex items-center gap-1.5">
                  <span>{emoji}</span>
                  {label}
                </span>
                <div className="flex-1 min-w-0 h-6 rounded-md bg-matcha-accent/15 overflow-hidden flex items-center">
                  <div
                    className="h-full rounded-md bg-matcha-accent/60 transition-[width] duration-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-medium text-matcha-dark tabular-nums shrink-0">
                  {avg.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Action commitment */}
        <section className="sm:col-span-2 rounded-xl border border-matcha-accent/15 bg-matcha-bg/40 px-6 py-5">
          <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-2 font-semibold">
            Action commitment
          </p>
          <p className="text-matcha-muted text-xs mb-3">
            Wrote an action item: {stats.actionFillCount} of {stats.totalParticipants}
          </p>
          <div className="h-2.5 rounded-full bg-matcha-accent/15 overflow-hidden max-w-xs">
            <div
              className="h-full rounded-full bg-matcha-accent transition-[width] duration-500"
              style={{ width: `${stats.actionFillRatePercent}%` }}
            />
          </div>
          <p className="text-lg font-semibold text-matcha-dark mt-2 tabular-nums">
            {stats.actionFillRatePercent.toFixed(1)}%
          </p>
        </section>
      </div>
    </div>
  );
}
