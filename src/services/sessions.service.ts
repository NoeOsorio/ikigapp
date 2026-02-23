import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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
  await setDoc(ref, { createdAt: serverTimestamp() as any, hostName, id: sessionId, archivedAt: null });
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const snap = await getDoc(sessionRef(sessionId));
  return snap.exists() ? snap.data() : null;
}

/** Soft-archive a session. It remains in Firestore but is excluded from analytics. */
export async function archiveSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, "sessions", sessionId), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    archivedAt: serverTimestamp() as any,
  });
}

/** Restore a previously archived session back to active. */
export async function unarchiveSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, "sessions", sessionId), { archivedAt: null });
}
