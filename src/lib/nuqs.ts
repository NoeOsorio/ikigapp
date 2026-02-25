import { parseAsString, parseAsStringLiteral } from "nuqs";

// Step values: lobby, 1-4 (categories), intersections, 5 (legacy redirect), snapshot.
export const STEP_VALUES = [
  "lobby",
  "1",
  "2",
  "3",
  "4",
  "intersections",
  "5",
  "snapshot",
] as const;
export type StepValue = (typeof STEP_VALUES)[number];

export const stepParser = parseAsStringLiteral(STEP_VALUES).withDefault(
  "lobby"
);

export const sessionParser = parseAsString;
export const nameParser = parseAsString;

import type { Intersections } from "../models/participant.model";

// Snapshot payload shape (used in memory / sessionStorage; not stored in URL)
export interface SnapshotPayload {
  name: string;
  c1: string[];
  c2: string[];
  c3: string[];
  c4: string[];
  action: string;
  /** New flow: AI intersections (optional for legacy). */
  intersections?: Intersections | null;
  /** New flow: user ikigai (optional for legacy). */
  ikigai?: string | null;
  /** New flow: concrete actions (optional for legacy). */
  actions?: string[] | null;
}

export function encodeSnapshotPayload(payload: SnapshotPayload): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function filterStringArray(arr: unknown): string[] {
  return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
}

function parseIntersections(v: unknown): Intersections | null {
  if (v == null || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  const p = o.pasion; const m = o.mision; const pr = o.profesion; const vc = o.vocacion;
  if (typeof p === "string" && typeof m === "string" && typeof pr === "string" && typeof vc === "string") {
    return { pasion: p, mision: m, profesion: pr, vocacion: vc };
  }
  return null;
}

export function parseSnapshotPayloadObject(o: Record<string, unknown>): SnapshotPayload {
  return {
    name: typeof o.name === "string" ? o.name : "",
    c1: filterStringArray(o.c1),
    c2: filterStringArray(o.c2),
    c3: filterStringArray(o.c3),
    c4: filterStringArray(o.c4),
    action: typeof o.action === "string" ? o.action : "",
    intersections: parseIntersections(o.intersections) ?? undefined,
    ikigai: typeof o.ikigai === "string" ? o.ikigai : undefined,
    actions: Array.isArray(o.actions) ? filterStringArray(o.actions) : undefined,
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
