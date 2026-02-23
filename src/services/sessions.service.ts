import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { sessionConverter, type Session } from "../models/session.model";

function sessionRef(sessionId: string) {
  return doc(db, "sessions", sessionId).withConverter(sessionConverter);
}

/**
 * Create (or silently overwrite) a session document.
 * Using merge:true makes this idempotent — safe to call multiple times.
 */
export async function createSession(sessionId: string, hostName: string): Promise<void> {
  await setDoc(
    sessionRef(sessionId),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { createdAt: serverTimestamp() as any, hostName, id: sessionId },
    { merge: true }
  );
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const snap = await getDoc(sessionRef(sessionId));
  return snap.exists() ? snap.data() : null;
}
