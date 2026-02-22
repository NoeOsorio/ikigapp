import {
  createParser,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

// Step values: lobby, 1-5 (category/action), snapshot
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

// Category items: stored as JSON array in a single param (c1, c2, c3, c4)
const parseJsonArray = (value: string | null): string[] => {
  if (value == null || value === "") return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
};

const serializeJsonArray = (arr: string[]): string =>
  encodeURIComponent(JSON.stringify(arr));

export const categoryArrayParser = createParser({
  parse: parseJsonArray,
  serialize: serializeJsonArray,
  eq: (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]),
}).withDefault([]);

// Action item (step 5)
export const actionParser = parseAsString;

// Snapshot payload (base64) in URL
export const payloadParser = parseAsString;

// Snapshot payload: base64 JSON { name, c1, c2, c3, c4, action }
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

export function decodeSnapshotPayload(encoded: string | null): SnapshotPayload | null {
  if (encoded == null || encoded === "") return null;
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const data = JSON.parse(json) as unknown;
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

export { useQueryState, useQueryStates } from "nuqs";
