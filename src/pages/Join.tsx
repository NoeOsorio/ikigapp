import { useQueryState, useQueryStates } from "nuqs";
import { useState } from "react";
import { nanoid } from "nanoid";
import { sessionParser, nameParser, stepParser } from "../lib/nuqs";

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
  const sessionLabel = session ? `Session #${session.slice(0, 8).toUpperCase()}` : null;

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center gap-0">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap font-serif text-8xl sm:text-[6rem] text-spring-accent opacity-[0.12] leading-none">
        生き甲斐
      </div>
      <header className="text-center mb-12 animate-fade-up">
        <h1 className="font-display text-3xl sm:text-4xl text-spring-dark tracking-tight mb-2">
          Discover Your Ikigai
        </h1>
        <p className="text-sm text-spring-muted tracking-[0.06em] uppercase">
          A guided journey through purpose
        </p>
      </header>

      <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-spring-accent/10 relative animate-[fade-up_0.9s_ease_0.15s_both]">
        <div className="absolute top-0 left-10 right-10 h-0.5 rounded-b bg-gradient-to-r from-transparent via-spring-accent to-transparent" />
        {hasSession && sessionLabel && (
          <div className="inline-flex items-center gap-1.5 bg-spring-bg border border-spring-accent/20 rounded-full py-1.5 px-3.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-spring-accent animate-pulse-dot" />
            <span className="text-xs text-spring-accent tracking-[0.06em] font-medium">
              {sessionLabel}
            </span>
          </div>
        )}
        {!hasSession && (
          <button
            type="button"
            onClick={handleCreateSession}
            className="w-full py-3.5 px-4 mb-6 rounded-xl border-2 border-spring-accent/30 bg-spring-bg/50 text-spring-dark font-medium hover:bg-spring-accent/10 transition-colors"
          >
            Create new session
          </button>
        )}
        <form onSubmit={handleJoin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3.5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[0.72rem] tracking-[0.1em] uppercase text-spring-muted mb-1 font-medium"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border-[1.5px] border-spring-accent/20 bg-spring-bg/30 font-body text-base text-spring-dark placeholder:text-spring-muted/80 outline-none transition-[border-color,box-shadow] focus:border-spring-accent focus:ring-[3px] focus:ring-spring-accent/20"
                placeholder="Hana"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-[0.72rem] tracking-[0.1em] uppercase text-spring-muted mb-1 font-medium"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border-[1.5px] border-spring-accent/20 bg-spring-bg/30 font-body text-base text-spring-dark placeholder:text-spring-muted/80 outline-none transition-[border-color,box-shadow] focus:border-spring-accent focus:ring-[3px] focus:ring-spring-accent/20"
                placeholder="Tanaka"
                autoComplete="family-name"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!canJoin}
            className="w-full py-4 rounded-xl bg-spring-dark text-white font-display text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-spring-accent hover:-translate-y-px min-h-[44px]"
          >
            Enter Session →
          </button>
        </form>
      </div>
    </div>
  );
}
