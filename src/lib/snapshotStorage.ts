import type { SnapshotPayload } from "./nuqs";

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
    const o = data as Record<string, unknown>;
    return {
      name: typeof o.name === "string" ? o.name : "",
      c1: Array.isArray(o.c1) ? o.c1.filter((x): x is string => typeof x === "string") : [],
      c2: Array.isArray(o.c2) ? o.c2.filter((x): x is string => typeof x === "string") : [],
      c3: Array.isArray(o.c3) ? o.c3.filter((x): x is string => typeof x === "string") : [],
      c4: Array.isArray(o.c4) ? o.c4.filter((x): x is string => typeof x === "string") : [],
      action: typeof o.action === "string" ? o.action : "",
    };
  } catch {
    return null;
  }
}

// Used by Lobby to store the snapshot URL for "Your Ikigai snapshot" link (no payload in URL)
export const SNAPSHOT_LINK_KEY = "ikigai_snapshot_link";

export function getSnapshotLinkKey(session: string, name: string): string {
  return `${SNAPSHOT_LINK_KEY}_${session}_${encodeURIComponent(name)}`;
}
