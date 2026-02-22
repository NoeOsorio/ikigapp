export function hasPayloadContent(p: { c1: string[]; c2: string[]; c3: string[]; c4: string[]; action: string }): boolean {
  return (
    p.c1.length > 0 ||
    p.c2.length > 0 ||
    p.c3.length > 0 ||
    p.c4.length > 0 ||
    p.action.trim() !== ""
  );
}
