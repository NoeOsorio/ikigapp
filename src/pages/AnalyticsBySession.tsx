import { useEffect, useState, useCallback } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  getParticipantsBySession,
  getAggregatedStats,
  type AggregatedStats,
} from "../services/analytics.service";
import { getSession, archiveSession, unarchiveSession } from "../services/sessions.service";
import { analyticsUrl } from "../lib/routes";
import AnalyticsInsights from "../components/AnalyticsInsights";
import type { Session } from "../models/session.model";

export default function AnalyticsBySession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    Promise.all([getSession(sessionId), getParticipantsBySession(sessionId)])
      .then(([s, participants]) => {
        if (!s) { setNotFound(true); return; }
        setSession(s);
        setStats(getAggregatedStats(1, participants));
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las estadísticas de la sesión"
        );
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => { load(); }, [load]);

  const handleToggleArchive = useCallback(async () => {
    if (!session) return;
    setToggling(true);
    try {
      if (session.archivedAt) {
        await unarchiveSession(session.id);
      } else {
        await archiveSession(session.id);
      }
      load();
    } finally {
      setToggling(false);
    }
  }, [session, load]);

  if (!sessionId) return <Navigate to={analyticsUrl()} replace />;

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <p className="text-matcha-muted text-sm animate-pulse">
          Cargando estadísticas de la sesión…
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 text-center py-12">
        <p className="text-matcha-muted text-sm">No se encontró la sesión.</p>
        <Link to={analyticsUrl()} className="text-matcha-accent text-sm font-medium hover:underline">
          Volver a estadísticas
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <p className="text-matcha-muted text-sm">{error}</p>
        <Link to={analyticsUrl()} className="mt-4 inline-block text-matcha-accent text-sm font-medium hover:underline">
          Volver a estadísticas
        </Link>
      </div>
    );
  }

  if (!stats || !session) return null;

  const isArchived = !!session.archivedAt;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <header>
        <Link
          to={analyticsUrl()}
          className="text-matcha-accent text-sm font-medium hover:underline mb-3 inline-block"
        >
          ← Estadísticas
        </Link>

        {/* Archived banner */}
        {isArchived && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
            <span aria-hidden>📦</span>
            <span>
              Esta sesión está archivada — no aparece en estadísticas globales. Solo accesible por enlace directo.
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-matcha-dark font-semibold tracking-tight mb-1">
              Estadísticas de la sesión
            </h1>
            <p className="text-matcha-muted text-sm font-mono">{sessionId}</p>
            {session.hostName ? (
              <p className="text-matcha-muted text-sm mt-0.5">
                Anfitrión: {session.hostName}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleToggleArchive}
            disabled={toggling}
            className={`shrink-0 mt-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 ${
              isArchived
                ? "border-matcha-accent/20 text-matcha-accent hover:border-matcha-accent/50"
                : "border-matcha-accent/15 text-matcha-muted hover:border-matcha-accent/40 hover:text-matcha-accent"
            }`}
          >
            {toggling ? "…" : isArchived ? "Restaurar sesión" : "Archivar sesión"}
          </button>
        </div>
      </header>

      <AnalyticsInsights stats={stats} singleSession />
    </div>
  );
}
