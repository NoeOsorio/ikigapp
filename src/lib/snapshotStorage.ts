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

// ── Draft persistence (localStorage): survives tab close so re-entry shows previous answers ──
const DRAFT_KEY_PREFIX = "ikigai_draft";

function draftStorageKey(session: string, name: string): string {
  return `${DRAFT_KEY_PREFIX}_${session}_${encodeURIComponent(name)}`;
}

export interface DraftPayload {
  c1: string[];
  c2: string[];
  c3: string[];
  c4: string[];
  action: string;
}

function filterStringArray(arr: unknown): string[] {
  return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
}

export function setDraftPayload(
  session: string,
  name: string,
  draft: DraftPayload
): void {
  try {
    localStorage.setItem(draftStorageKey(session, name), JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function getDraftPayload(
  session: string,
  name: string
): DraftPayload | null {
  try {
    const raw = localStorage.getItem(draftStorageKey(session, name));
    if (raw == null || raw === "") return null;
    const data = JSON.parse(raw) as unknown;
    if (data == null || typeof data !== "object") return null;
    const o = data as Record<string, unknown>;
    return {
      c1: filterStringArray(o.c1),
      c2: filterStringArray(o.c2),
      c3: filterStringArray(o.c3),
      c4: filterStringArray(o.c4),
      action: typeof o.action === "string" ? o.action : "",
    };
  } catch {
    return null;
  }
}
