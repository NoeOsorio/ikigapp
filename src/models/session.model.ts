import type { Timestamp, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export interface Session {
  id: string;
  createdAt: Timestamp;
  hostName: string;
}

export const sessionConverter: FirestoreDataConverter<Session> = {
  toFirestore(session: Session): DocumentData {
    return {
      createdAt: session.createdAt,
      hostName: session.hostName,
    };
  },
  fromFirestore(snap: QueryDocumentSnapshot): Session {
    const d = snap.data();
    return {
      id: snap.id,
      createdAt: d.createdAt as Timestamp,
      hostName: typeof d.hostName === "string" ? d.hostName : "",
    };
  },
};
