import type { Timestamp, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export interface Session {
  id: string;
  createdAt: Timestamp;
  hostName: string;
  /** Set when the session is soft-archived. Archived sessions are hidden from analytics. */
  archivedAt: Timestamp | null;
}

export const sessionConverter: FirestoreDataConverter<Session> = {
  toFirestore(session: Session): DocumentData {
    return {
      createdAt: session.createdAt,
      hostName: session.hostName,
      archivedAt: session.archivedAt,
    };
  },
  fromFirestore(snap: QueryDocumentSnapshot): Session {
    const d = snap.data();
    return {
      id: snap.id,
      createdAt: d.createdAt as Timestamp,
      hostName: typeof d.hostName === "string" ? d.hostName : "",
      archivedAt: d.archivedAt ?? null,
    };
  },
};
