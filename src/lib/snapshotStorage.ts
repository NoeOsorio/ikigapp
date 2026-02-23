import { parseSnapshotPayloadObject, type SnapshotPayload } from "./nuqs";

const STORAGE_KEY_PREFIX = "ikigai_snapshot_payload";

function storageKey(session: string, name: string): string {
  return `${STORAGE_KEY_PREFIX}_${session}_${encodeURIComponent(name)}`;
}

export function setSnapshotPayload(
  session: string,
  name: string,
  payload: SnapshotPayload
): void {
  try {
    sessionStorage.setItem(
      storageKey(session, name),
      JSON.stringify(payload)
    );
  } catch {
    // ignore
  }
}

export function getSnapshotPayload(
  session: string,
  name: string
): SnapshotPayload | null {
  try {
    const raw = sessionStorage.getItem(storageKey(session, name));
    if (raw == null || raw === "") return null;
    const data = JSON.parse(raw) as unknown;
    if (data == null || typeof data !== "object") return null;
    return parseSnapshotPayloadObject(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

// Used by Lobby to store the snapshot URL for "Your Ikigai snapshot" link (no payload in URL)
export const SNAPSHOT_LINK_KEY = "ikigai_snapshot_link";

export function getSnapshotLinkKey(session: string, name: string): string {
  return `${SNAPSHOT_LINK_KEY}_${session}_${encodeURIComponent(name)}`;
}
