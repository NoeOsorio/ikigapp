import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { nanoid } from "nanoid";
import { workshopUrl } from "../lib/routes";

export default function Join() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionIdFromUrl = searchParams.get("session") ?? "";
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleCreateSession = () => {
    setSearchParams({ session: nanoid(10) });
  };

  const handleJoinWithId = (e: React.FormEvent) => {
    e.preventDefault();
    const id = sessionIdInput.trim();
    if (id) setSearchParams({ session: id });
  };

  const handleEnterSession = (e: React.FormEvent) => {
    e.preventDefault();
    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!name || !sessionIdFromUrl) return;
    navigate(workshopUrl(sessionIdFromUrl, name, "lobby"));
  };

  const hasSession = sessionIdFromUrl !== "";
  const canEnterSession = hasSession && Boolean(firstName.trim() && lastName.trim());
  const sessionLabel = hasSession ? `Session #${sessionIdFromUrl.slice(0, 8).toUpperCase()}` : null;
  const canJoinWithId = sessionIdInput.trim() !== "";

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center gap-0 px-4">
      {/* Large decorative kanji watermark */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none font-serif text-[7rem] sm:text-[9rem] text-dawn-accent opacity-[0.14] leading-none tracking-tighter"
        aria-hidden
      >
        生き甲斐
      </div>

      <header className="text-center mb-10 sm:mb-14 animate-fade-up relative">
        <p className="text-xs text-dawn-muted tracking-[0.2em] uppercase mb-3 font-medium">
          Find your purpose
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-dawn-dark tracking-tight mb-2.5 font-semibold">
          Discover Your Ikigai
        </h1>
        <p className="text-sm text-dawn-muted tracking-[0.08em] max-w-xs mx-auto">
          A guided journey through the four seasons of what you love, what you’re good at, what the world needs, and what you can be paid for.
        </p>
      </header>

      <div className="w-full bg-white rounded-3xl sm:rounded-[28px] p-8 sm:p-10 shadow-xl border border-dawn-accent/15 relative animate-[fade-up_0.9s_ease_0.15s_both] ring-1 ring-black/5">
        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-1 rounded-b-full bg-linear-to-r from-transparent via-dawn-accent/80 to-transparent" />

        {!hasSession ? (
          <div className="flex flex-col gap-5 mb-2">
            <button
              type="button"
              onClick={handleCreateSession}
              className="w-full py-3.5 px-4 rounded-xl border-2 border-dawn-accent/35 bg-dawn-bg/60 text-dawn-dark font-medium hover:bg-dawn-accent/15 hover:border-dawn-accent/50 transition-all duration-200"
            >
              Create new session
            </button>
            <div className="relative flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-dawn-accent/20 after:content-[''] after:flex-1 after:h-px after:bg-dawn-accent/20">
              <span className="text-[0.65rem] tracking-widest uppercase text-dawn-muted font-medium">or</span>
            </div>
            <form onSubmit={handleJoinWithId} className="flex flex-col gap-3">
              <label
                htmlFor="sessionId"
                className="block text-[0.7rem] tracking-[0.12em] uppercase text-dawn-muted mb-1 font-medium"
              >
                Session ID
              </label>
              <div className="flex gap-2">
                <input
                  id="sessionId"
                  type="text"
                  value={sessionIdInput}
                  onChange={(e) => setSessionIdInput(e.target.value)}
                  placeholder="Paste or type session ID"
                  className="flex-1 py-3.5 px-4 rounded-xl border-2 border-dawn-accent/20 bg-dawn-bg/40 font-body text-base text-dawn-dark placeholder:text-dawn-muted/70 outline-none transition-all duration-200 focus:border-dawn-accent focus:ring-4 focus:ring-dawn-accent/15"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!canJoinWithId}
                  className="py-3.5 px-5 rounded-xl border-2 border-dawn-accent/35 bg-dawn-bg/60 text-dawn-dark font-medium hover:bg-dawn-accent/15 hover:border-dawn-accent/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  Join session
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {sessionLabel && (
              <div className="inline-flex items-center gap-2 bg-dawn-bg/80 border border-dawn-accent/25 rounded-full py-2 px-4 mb-6">
                <span className="w-2 h-2 rounded-full bg-dawn-accent animate-pulse-dot" />
                <span className="text-xs text-dawn-accent tracking-[0.08em] font-medium">
                  {sessionLabel}
                </span>
              </div>
            )}
            <form onSubmit={handleEnterSession} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-[0.7rem] tracking-[0.12em] uppercase text-dawn-muted mb-1.5 font-medium"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-dawn-accent/20 bg-dawn-bg/40 font-body text-base text-dawn-dark placeholder:text-dawn-muted/70 outline-none transition-all duration-200 focus:border-dawn-accent focus:ring-4 focus:ring-dawn-accent/15"
                    placeholder="Hana"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-[0.7rem] tracking-[0.12em] uppercase text-dawn-muted mb-1.5 font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-dawn-accent/20 bg-dawn-bg/40 font-body text-base text-dawn-dark placeholder:text-dawn-muted/70 outline-none transition-all duration-200 focus:border-dawn-accent focus:ring-4 focus:ring-dawn-accent/15"
                    placeholder="Tanaka"
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!canEnterSession}
                className="w-full py-4 rounded-xl bg-dawn-dark text-white font-display text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-dawn-accent hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] shadow-lg shadow-dawn-dark/20 hover:shadow-dawn-accent/25"
              >
                Enter Session →
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-dawn-muted/90 max-w-[280px] animate-[fade-up_0.6s_ease_0.3s_both]">
        Your journey starts with one step. Share the session link so others can join.
      </p>
    </div>
  );
}
