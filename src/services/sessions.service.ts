import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { sessionConverter, type Session } from "../models/session.model";

function sessionRef(sessionId: string) {
  return doc(db, "sessions", sessionId).withConverter(sessionConverter);
}

/**
 * Create a session document only if it does not already exist.
 * This prevents subsequent joiners from overwriting the original hostName.
 */
export async function createSession(sessionId: string, hostName: string): Promise<void> {
  const ref = sessionRef(sessionId);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await setDoc(ref, { createdAt: serverTimestamp() as any, hostName, id: sessionId });
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const snap = await getDoc(sessionRef(sessionId));
  return snap.exists() ? snap.data() : null;
}
