/** Payload has enough content to show a snapshot (legacy or new flow). */
export function hasPayloadContent(p: {
  c1: string[];
  c2: string[];
  c3: string[];
  c4: string[];
  action: string;
  intersections?: { pasion: string; mision: string; profesion: string; vocacion: string } | null;
  ikigai?: string | null;
  actions?: string[] | null;
}): boolean {
  const hasNew =
    p.intersections != null &&
    (p.ikigai ?? "").trim() !== "" &&
    (p.actions?.length ?? 0) >= 1;
  if (hasNew) return true;
  return (
    p.c1.length > 0 ||
    p.c2.length > 0 ||
    p.c3.length > 0 ||
    p.c4.length > 0 ||
    p.action.trim() !== ""
  );
}

/** True if payload has the new intersections flow (for snapshot card mode). */
export function hasNewSnapshotContent(p: {
  intersections?: { pasion: string; mision: string; profesion: string; vocacion: string } | null;
  ikigai?: string | null;
  actions?: string[] | null;
}): boolean {
  return (
    p.intersections != null &&
    (p.ikigai ?? "").trim() !== "" &&
    (p.actions?.length ?? 0) >= 1
  );
}
