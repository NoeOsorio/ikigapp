import type { StepValue } from "./nuqs";

/** Join/create session. Optionally pass a session id to pre-fill. */
export function sessionUrl(sessionId?: string): string {
  if (sessionId == null || sessionId === "") return "/session";
  return `/session?session=${encodeURIComponent(sessionId)}`;
}

/** Workshop flow: lobby + steps 1–5. */
export function workshopUrl(
  session: string,
  name: string,
  step: StepValue
): string {
  const params = new URLSearchParams();
  params.set("session", session);
  params.set("name", name);
  params.set("step", step);
  return `/workshop?${params.toString()}`;
}

/** Result (snapshot) page. */
export function resultUrl(session: string, name: string): string {
  const params = new URLSearchParams();
  params.set("session", session);
  params.set("name", name);
  return `/result?${params.toString()}`;
}
