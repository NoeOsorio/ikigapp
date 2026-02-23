import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  getParticipantsBySession,
  getAggregatedStats,
  type AggregatedStats,
} from "../services/analytics.service";
import { getSession } from "../services/sessions.service";
import { analyticsUrl } from "../lib/routes";
import AnalyticsInsights from "../components/AnalyticsInsights";

export default function AnalyticsBySession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [hostName, setHostName] = useState<string>("");

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);
    Promise.all([
      getSession(sessionId),
      getParticipantsBySession(sessionId),
    ])
      .then(([session, participants]) => {
        if (cancelled) return;
        if (!session) {
          setNotFound(true);
          return;
        }
        setHostName(session.hostName || "");
        setStats(getAggregatedStats(1, participants));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load session analytics");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) {
    return <Navigate to={analyticsUrl()} replace />;
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <p className="text-matcha-muted text-sm animate-pulse">Loading session analytics…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 text-center py-12">
        <p className="text-matcha-muted text-sm">Session not found.</p>
        <Link
          to={analyticsUrl()}
          className="text-matcha-accent text-sm font-medium hover:underline"
        >
          Back to Analytics
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <p className="text-matcha-muted text-sm">{error}</p>
        <Link
          to={analyticsUrl()}
          className="mt-4 inline-block text-matcha-accent text-sm font-medium hover:underline"
        >
          Back to Analytics
        </Link>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <header>
        <Link
          to={analyticsUrl()}
          className="text-matcha-accent text-sm font-medium hover:underline mb-3 inline-block"
        >
          ← Analytics
        </Link>
        <h1 className="font-display text-2xl text-matcha-dark font-semibold tracking-tight mb-1">
          Session analytics
        </h1>
        <p className="text-matcha-muted text-sm font-mono">{sessionId}</p>
        {hostName ? (
          <p className="text-matcha-muted text-sm mt-0.5">Host: {hostName}</p>
        ) : null}
      </header>

      <AnalyticsInsights stats={stats} singleSession />
    </div>
  );
}
