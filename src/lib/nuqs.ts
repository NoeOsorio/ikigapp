import { parseAsString, parseAsStringLiteral } from "nuqs";

// Step values: lobby, 1-5 (category/action), snapshot. Form data (c1-c4, action) lives in IkigaiFormContext, not URL.
export const STEP_VALUES = [
  "lobby",
  "1",
  "2",
  "3",
  "4",
  "5",
  "snapshot",
] as const;
export type StepValue = (typeof STEP_VALUES)[number];

export const stepParser = parseAsStringLiteral(STEP_VALUES).withDefault(
  "lobby"
);

export const sessionParser = parseAsString;
export const nameParser = parseAsString;

// Snapshot payload shape (used in memory / sessionStorage; not stored in URL)
export interface SnapshotPayload {
  name: string;
  c1: string[];
  c2: string[];
  c3: string[];
  c4: string[];
  action: string;
}

export function encodeSnapshotPayload(payload: SnapshotPayload): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function filterStringArray(arr: unknown): string[] {
  return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
}

export function parseSnapshotPayloadObject(o: Record<string, unknown>): SnapshotPayload {
  return {
    name: typeof o.name === "string" ? o.name : "",
    c1: filterStringArray(o.c1),
    c2: filterStringArray(o.c2),
    c3: filterStringArray(o.c3),
    c4: filterStringArray(o.c4),
    action: typeof o.action === "string" ? o.action : "",
  };
}

export function decodeSnapshotPayload(encoded: string | null): SnapshotPayload | null {
  if (encoded == null || encoded === "") return null;
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const data = JSON.parse(json) as unknown;
    if (data == null || typeof data !== "object") return null;
    return parseSnapshotPayloadObject(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export { useQueryState, useQueryStates } from "nuqs";
