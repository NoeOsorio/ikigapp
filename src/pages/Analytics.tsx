import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSessionsCount,
  getAllParticipants,
  getSessions,
  getAggregatedStats,
  type AggregatedStats,
} from "../services/analytics.service";
import { analyticsSessionUrl } from "../lib/routes";
import AnalyticsInsights from "../components/AnalyticsInsights";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [sessions, setSessions] = useState<Array<{ id: string; hostName: string }>>([]);

  useEffect(() => {
    let cancelled = false;
    setTimeout(() => {
      setLoading(true);
    }, 0);
    setTimeout(() => {
      setError(null);
    }, 0);
    Promise.all([getSessionsCount(), getAllParticipants(), getSessions()])
      .then(([sessionsCount, participants, sessionsList]) => {
        if (cancelled) return;
        setStats(getAggregatedStats(sessionsCount, participants));
        setSessions(sessionsList);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar las estadísticas");
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
        <p className="text-matcha-muted text-sm animate-pulse">Cargando estadísticas…</p>
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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-display text-2xl text-matcha-dark font-semibold tracking-tight mb-1">
          Estadísticas
        </h1>
        <p className="text-matcha-muted text-sm">Hallazgos de sesiones de Ikigai completadas</p>
      </header>

      <AnalyticsInsights stats={stats} />

      <section className="rounded-xl border border-matcha-accent/15 bg-matcha-bg/40 px-6 py-5">
        <p className="text-[0.68rem] tracking-[0.14em] uppercase text-matcha-accent mb-4 font-semibold">
          Analizar por sesión
        </p>
        <p className="text-matcha-muted text-sm mb-4">
          Ver métricas de una sesión concreta.
        </p>
        {sessions.length === 0 ? (
          <p className="text-matcha-muted text-sm">No hay sesiones.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  to={analyticsSessionUrl(s.id)}
                  className="block rounded-lg border border-matcha-accent/15 bg-matcha-bg/60 px-4 py-3 text-matcha-dark hover:border-matcha-accent/30 hover:bg-matcha-bg/80 transition-colors text-sm font-medium"
                >
                  <span className="font-mono text-matcha-accent">{s.id}</span>
                  {s.hostName ? (
                    <span className="text-matcha-muted ml-2">· {s.hostName}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
