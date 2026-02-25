import type { Timestamp, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import type { StepValue } from "../lib/nuqs";

/** AI-generated four Ikigai intersections. */
export interface Intersections {
  pasion: string;
  mision: string;
  profesion: string;
  vocacion: string;
}

export interface ParticipantAnswers {
  c1: string[];
  c2: string[];
  c3: string[];
  c4: string[];
  action: string;
  /** AI-generated four intersections (optional for legacy participants). */
  intersections?: Intersections | null;
  /** User-written Ikigai statement (optional for legacy). */
  ikigai?: string | null;
  /** Concrete actions, min 1 (optional for legacy). */
  actions?: string[] | null;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  /** Current step in the Ikigai flow. */
  step: StepValue;
  answers: ParticipantAnswers;
  /** Snapshot result URL — set when the participant reaches the Snapshot page. */
  shareLink: string | null;
  /** True once shareLink has been stored (flow is complete). */
  isFinished: boolean;
  /** AI-generated Ikigai summary. Set once; skipped on subsequent views to save tokens. */
  aiIkigai: string | null;
  joinedAt: Timestamp;
  updatedAt: Timestamp;
}

export const EMPTY_ANSWERS: ParticipantAnswers = {
  c1: [],
  c2: [],
  c3: [],
  c4: [],
  action: "",
};

/**
 * Derive the Firestore document ID from a participant's full name.
 * "Hana Tanaka" → "hana-tanaka"
 *
 * The name stored in the URL is always "<firstName> <lastName>" (space-joined),
 * so we split on the first space to reconstruct the two parts.
 */
export function nameToParticipantId(fullName: string): string {
  const [first = "", ...rest] = fullName.trim().split(" ");
  const last = rest.join(" ");
  return `${first.toLowerCase()}-${last.toLowerCase()}`.replace(/\s+/g, "-");
}

/** Reconstruct a full display name from first + last. */
export function participantDisplayName(p: Pick<Participant, "firstName" | "lastName">): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ");
}

function filterStringArray(arr: unknown): string[] {
  return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
}

export const participantConverter: FirestoreDataConverter<Participant> = {
  toFirestore(p: Participant): DocumentData {
    return {
      firstName: p.firstName,
      lastName: p.lastName,
      step: p.step,
      answers: p.answers,
      shareLink: p.shareLink ?? null,
      isFinished: p.isFinished,
      aiIkigai: p.aiIkigai ?? null,
      joinedAt: p.joinedAt,
      updatedAt: p.updatedAt,
    };
  },
  fromFirestore(snap: QueryDocumentSnapshot): Participant {
    const d = snap.data();
    const raw = (d.answers ?? {}) as Record<string, unknown>;
    const intersectionsRaw = raw.intersections as Record<string, unknown> | undefined;
    let intersections: Intersections | null = null;
    if (intersectionsRaw != null && typeof intersectionsRaw === "object" && !Array.isArray(intersectionsRaw)) {
      const p = intersectionsRaw.pasion; const m = intersectionsRaw.mision;
      const pr = intersectionsRaw.profesion; const v = intersectionsRaw.vocacion;
      if (typeof p === "string" && typeof m === "string" && typeof pr === "string" && typeof v === "string") {
        intersections = { pasion: p, mision: m, profesion: pr, vocacion: v };
      }
    }
    return {
      id: snap.id,
      firstName: typeof d.firstName === "string" ? d.firstName : "",
      lastName: typeof d.lastName === "string" ? d.lastName : "",
      step: (d.step as StepValue) ?? "lobby",
      answers: {
        c1: filterStringArray(raw.c1),
        c2: filterStringArray(raw.c2),
        c3: filterStringArray(raw.c3),
        c4: filterStringArray(raw.c4),
        action: typeof raw.action === "string" ? raw.action : "",
        intersections: intersections ?? undefined,
        ikigai: typeof raw.ikigai === "string" ? raw.ikigai : undefined,
        actions: Array.isArray(raw.actions) ? (raw.actions as string[]).filter((x): x is string => typeof x === "string") : undefined,
      },
      shareLink: typeof d.shareLink === "string" ? d.shareLink : null,
      isFinished: d.isFinished === true,
      aiIkigai: typeof d.aiIkigai === "string" ? d.aiIkigai : null,
      joinedAt: d.joinedAt as Timestamp,
      updatedAt: d.updatedAt as Timestamp,
    };
  },
};
