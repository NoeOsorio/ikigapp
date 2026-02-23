import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { participantConverter, type Participant } from "../models/participant.model";

export interface AggregatedStats {
  totalSessions: number;
  totalParticipants: number;
  finishedCount: number;
  completionRatePercent: number;
  avgPerQuadrant: { c1: number; c2: number; c3: number; c4: number };
  actionFillCount: number;
  actionFillRatePercent: number;
}

/** Returns the number of session documents. */
export async function getSessionsCount(): Promise<number> {
  const snap = await getDocs(collection(db, "sessions"));
  return snap.size;
}

/** Returns all participants across all sessions (collection group query). */
export async function getAllParticipants(): Promise<Participant[]> {
  const snap = await getDocs(
    collectionGroup(db, "participants").withConverter(participantConverter)
  );
  return snap.docs.map((d) => d.data());
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
