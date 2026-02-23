import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { participantConverter, type Participant } from "../models/participant.model";
import { sessionConverter, type Session } from "../models/session.model";

export interface AggregatedStats {
  totalSessions: number;
  totalParticipants: number;
  finishedCount: number;
  completionRatePercent: number;
  avgPerQuadrant: { c1: number; c2: number; c3: number; c4: number };
  actionFillCount: number;
  actionFillRatePercent: number;
}

export type ParticipantWithSession = Participant & { sessionId: string };

/** Returns the number of session documents (includes archived). */
export async function getSessionsCount(): Promise<number> {
  const snap = await getDocs(collection(db, "sessions"));
  return snap.size;
}

/** Returns all sessions including archivedAt. */
export async function getSessions(): Promise<Session[]> {
  const snap = await getDocs(
    collection(db, "sessions").withConverter(sessionConverter)
  );
  return snap.docs.map((d) => d.data());
}

/** Returns all participants for a given session. */
export async function getParticipantsBySession(
  sessionId: string
): Promise<Participant[]> {
  const snap = await getDocs(
    collection(db, "sessions", sessionId, "participants").withConverter(
      participantConverter
    )
  );
  return snap.docs.map((d) => d.data());
}

/**
 * Returns all participants across all sessions via a collection group query.
 * Each entry includes `sessionId` extracted from the Firestore document reference
 * so callers can filter by session (e.g. to exclude archived sessions).
 */
export async function getAllParticipants(): Promise<ParticipantWithSession[]> {
  const snap = await getDocs(
    collectionGroup(db, "participants").withConverter(participantConverter)
  );
  return snap.docs.map((d) => ({
    ...d.data(),
    sessionId: d.ref.parent.parent?.id ?? "",
  }));
}

/** Computes aggregated stats from session count and participant list. */
export function getAggregatedStats(
  sessionsCount: number,
  participants: Participant[]
): AggregatedStats {
  const totalParticipants = participants.length;
  const finishedCount = participants.filter((p) => p.isFinished).length;
  const completionRatePercent =
    totalParticipants > 0 ? (finishedCount / totalParticipants) * 100 : 0;

  const withAnyAnswer = participants.filter(
    (p) =>
      p.answers.c1.length > 0 ||
      p.answers.c2.length > 0 ||
      p.answers.c3.length > 0 ||
      p.answers.c4.length > 0
  );
  const n = withAnyAnswer.length;
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const avgPerQuadrant = {
    c1: n > 0 ? sum(withAnyAnswer.map((p) => p.answers.c1.length)) / n : 0,
    c2: n > 0 ? sum(withAnyAnswer.map((p) => p.answers.c2.length)) / n : 0,
    c3: n > 0 ? sum(withAnyAnswer.map((p) => p.answers.c3.length)) / n : 0,
    c4: n > 0 ? sum(withAnyAnswer.map((p) => p.answers.c4.length)) / n : 0,
  };

  const actionFillCount = participants.filter(
    (p) => (p.answers.action ?? "").trim() !== ""
  ).length;
  const actionFillRatePercent =
    totalParticipants > 0 ? (actionFillCount / totalParticipants) * 100 : 0;

  return {
    totalSessions: sessionsCount,
    totalParticipants,
    finishedCount,
    completionRatePercent,
    avgPerQuadrant,
    actionFillCount,
    actionFillRatePercent,
  };
}
