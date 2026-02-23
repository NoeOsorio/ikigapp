import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  participantConverter,
  nameToParticipantId,
  EMPTY_ANSWERS,
  type Participant,
  type ParticipantAnswers,
} from "../models/participant.model";
import type { StepValue } from "../lib/nuqs";

function participantsCol(sessionId: string) {
  return collection(db, "sessions", sessionId, "participants").withConverter(participantConverter);
}

function participantRef(sessionId: string, participantId: string) {
  return doc(db, "sessions", sessionId, "participants", participantId).withConverter(participantConverter);
}

export interface CreateParticipantInput {
  firstName: string;
  lastName: string;
}

/** Write a new participant document. Idempotent (merge keeps existing answers). */
export async function createParticipant(
  sessionId: string,
  { firstName, lastName }: CreateParticipantInput
): Promise<void> {
  const id = nameToParticipantId(`${firstName} ${lastName}`);
  await setDoc(
    participantRef(sessionId, id),
    {
      id,
      firstName,
      lastName,
      step: "lobby" as StepValue,
      answers: EMPTY_ANSWERS,
      shareLink: null,
      isFinished: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      joinedAt: serverTimestamp() as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedAt: serverTimestamp() as any,
    },
    { merge: true }
  );
}

export async function getParticipant(
  sessionId: string,
  participantId: string
): Promise<Participant | null> {
  const snap = await getDoc(participantRef(sessionId, participantId));
  return snap.exists() ? snap.data() : null;
}

export async function updateParticipantStep(
  sessionId: string,
  participantId: string,
  step: StepValue
): Promise<void> {
  await updateDoc(participantRef(sessionId, participantId), {
    step,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedAt: serverTimestamp() as any,
  });
}

export async function updateParticipantAnswers(
  sessionId: string,
  participantId: string,
  answers: Partial<ParticipantAnswers>
): Promise<void> {
  // Use dot-notation keys so only provided fields are overwritten
  const patch: Record<string, unknown> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedAt: serverTimestamp() as any,
  };
  for (const [key, value] of Object.entries(answers)) {
    patch[`answers.${key}`] = value;
  }
  await updateDoc(participantRef(sessionId, participantId), patch);
}

export async function saveShareLink(
  sessionId: string,
  participantId: string,
  shareLink: string
): Promise<void> {
  await updateDoc(participantRef(sessionId, participantId), {
    shareLink,
    isFinished: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedAt: serverTimestamp() as any,
  });
}

/** Subscribe to all participants in a session. Returns the unsubscribe function. */
export function subscribeToParticipants(
  sessionId: string,
  callback: (participants: Participant[]) => void
): Unsubscribe {
  return onSnapshot(participantsCol(sessionId), (snap) => {
    callback(snap.docs.map((d) => d.data()));
  });
}
