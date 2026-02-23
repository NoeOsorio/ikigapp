import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getAllParticipants,
  getSessions,
  getAggregatedStats,
  type AggregatedStats,
} from "../services/analytics.service";
import { archiveSession, unarchiveSession } from "../services/sessions.service";
import { analyticsSessionUrl } from "../lib/routes";
import AnalyticsInsights from "../components/AnalyticsInsights";
import type { Session } from "../models/session.model";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [archivedSessions, setArchivedSessions] = useState<Session[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getAllParticipants(), getSessions()])
      .then(([allParticipants, sessionsList]) => {
        const active = sessionsList.filter((s) => !s.archivedAt);
        const archived = sessionsList.filter((s) => !!s.archivedAt);
        const activeIds = new Set(active.map((s) => s.id));
        const activeParticipants = allParticipants.filter((p) =>
          activeIds.has(p.sessionId)
        );
        setStats(getAggregatedStats(active.length, activeParticipants));
        setActiveSessions(active);
        setArchivedSessions(archived);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las estadísticas"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleArchive = useCallback(
    async (session: Session) => {
      setTogglingId(session.id);
      try {
        if (session.archivedAt) {
          await unarchiveSession(session.id);
        } else {
          await archiveSession(session.id);
        }
        load();
      } finally {
        setTogglingId(null);
      }
    },
    [load]
  );

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <p className="text-matcha-muted text-sm animate-pulse">
          Cargando estadísticas…
        </p>
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

  if (!stats) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-display text-2xl text-matcha-dark font-semibold tracking-tight mb-1">
          Estadísticas
        </h1>
        <p className="text-matcha-muted text-sm">
          Hallazgos de sesiones activas de Ikigai
        </p>
      </header>

      <AnalyticsInsights stats={stats} />

      {/* Active sessions */}
      <section className="rounded-xl border border-matcha-accent/15 bg-matcha-bg/40 px-6 py-5">
        <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-4 font-semibold">
          Analizar por sesión
        </p>
        <p className="text-matcha-muted text-sm mb-4">
          Ver métricas de una sesión concreta.
        </p>
        {activeSessions.length === 0 ? (
          <p className="text-matcha-muted text-sm">No hay sesiones activas.</p>
        ) : (
          <ul className="space-y-2">
            {activeSessions.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <Link
                  to={analyticsSessionUrl(s.id)}
                  className="flex-1 rounded-lg border border-matcha-accent/15 bg-matcha-bg/60 px-4 py-3 text-matcha-dark hover:border-matcha-accent/30 hover:bg-matcha-bg/80 transition-colors text-sm font-medium"
                >
                  <span className="font-mono text-matcha-accent">{s.id}</span>
                  {s.hostName ? (
                    <span className="text-matcha-muted ml-2">
                      · {s.hostName}
                    </span>
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => handleToggleArchive(s)}
                  disabled={togglingId === s.id}
                  title="Archivar sesión"
                  className="shrink-0 px-3 py-3 rounded-lg border border-matcha-accent/15 text-matcha-muted hover:border-matcha-accent/40 hover:text-matcha-accent transition-colors text-xs disabled:opacity-40"
                >
                  {togglingId === s.id ? "…" : "Archivar"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Archived sessions */}
      {archivedSessions.length > 0 && (
        <section className="rounded-xl border border-matcha-accent/10 bg-matcha-bg/20 px-6 py-5">
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            className="w-full flex items-center justify-between text-[0.68rem] tracking-[0.14em] uppercase text-matcha-muted font-semibold mb-1"
          >
            <span>Sesiones archivadas ({archivedSessions.length})</span>
            <span className="text-base leading-none">
              {showArchived ? "▴" : "▾"}
            </span>
          </button>
          <p className="text-matcha-muted text-xs mb-3">
            No se cuentan en estadísticas. Accesibles por enlace directo.
          </p>
          {showArchived && (
            <ul className="space-y-2 mt-3">
              {archivedSessions.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <Link
                    to={analyticsSessionUrl(s.id)}
                    className="flex-1 rounded-lg border border-matcha-accent/10 bg-matcha-bg/30 px-4 py-3 text-matcha-muted hover:border-matcha-accent/20 transition-colors text-sm opacity-70"
                  >
                    <span className="font-mono">{s.id}</span>
                    {s.hostName ? (
                      <span className="ml-2">· {s.hostName}</span>
                    ) : null}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleToggleArchive(s)}
                    disabled={togglingId === s.id}
                    title="Restaurar sesión"
                    className="shrink-0 px-3 py-3 rounded-lg border border-matcha-accent/10 text-matcha-muted hover:border-matcha-accent/30 hover:text-matcha-accent transition-colors text-xs disabled:opacity-40"
                  >
                    {togglingId === s.id ? "…" : "Restaurar"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
