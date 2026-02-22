import { useQueryState, useQueryStates } from "nuqs";
import { useState } from "react";
import { nanoid } from "nanoid";
import {
  sessionParser,
  nameParser,
  stepParser,
} from "../lib/nuqs";

export default function Join() {
  const [session, setSession] = useQueryState("session", sessionParser);
  const [, setJoinState] = useQueryStates(
    { session: sessionParser, name: nameParser, step: stepParser },
    { shallow: false }
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleCreateSession = () => {
    if (!session) setSession(nanoid(10));
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!name) return;
    const newSession = session ?? nanoid(10);
    setJoinState({ session: newSession, name, step: "lobby" });
  };

  const hasSession = session != null && session !== "";
  const canJoin = firstName.trim() && lastName.trim();

  return (
    <main className="w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
        生き甲斐
      </h1>
      <p className="text-[var(--color-ink-muted)] mb-8 text-sm">
        Join the session to discover your Ikigai together.
      </p>
      {!hasSession && (
        <button
          type="button"
          onClick={handleCreateSession}
          className="w-full py-3 px-4 mb-6 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] rounded hover:bg-[var(--color-bg-subtle)]"
        >
          Create new session
        </button>
      )}
      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm text-[var(--color-ink-muted)] mb-1">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full py-2 px-3 border border-[var(--color-border)] bg-[var(--color-surface)] rounded text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
            placeholder="First name"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm text-[var(--color-ink-muted)] mb-1">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full py-2 px-3 border border-[var(--color-border)] bg-[var(--color-surface)] rounded text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
            placeholder="Last name"
            autoComplete="family-name"
          />
        </div>
        <button
          type="submit"
          disabled={!canJoin}
          className="w-full py-3 px-4 bg-[var(--color-accent)] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-accent-hover)]"
        >
          {hasSession ? "Join session" : "Create & join"}
        </button>
      </form>
    </main>
  );
}
