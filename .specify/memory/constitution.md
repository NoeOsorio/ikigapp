# Ikigapp Constitution

## Core Principles

### I. Done Is What People See

Every spec carries an acceptance bar written from the screens a participant and a facilitator
actually use, at phone width first and then desktop. A feature is done only when it has been run
end to end the way they will use it (a real session, a real phone), graded by a reviewer who did
not build it, with screenshots attached to the Linear ticket. Builds and lint are the floor, not
the proof. No new unit tests are written.

### II. Root Cause, Not Patches

Every plan names the root cause it removes. Regexes, post-filters, retries that hide an error, or
special cases that mask a symptom are rejected. When a class of failure can recur, the fix makes it
impossible or loudly visible.

### III. Plan Before Code

Nothing is built from a chat message. Spec Kit runs end to end (specify, clarify, plan, tasks,
analyze, implement). Noe approves the spec and plan before any code. Opus writes the plan and
reviews every diff; Sonnet subagents implement the approved tasks.

### IV. No Silent Failure, No Mock Data

The app MUST NOT pretend something worked. If an answer was not saved, a session could not be
joined, or the AI could not respond, the person sees it in plain Spanish with a way to retry, and
the technical detail goes to logs. There is no fallback to placeholder, sample or mock data on any
path a real button can reach. Loading states always end, in content or in an error.

### V. Private by Default

A participant's answers are visible only to that participant and to the facilitator of their
session. Identity is never derived from a typed name: participants get an unguessable private
link, facilitators sign in. Statistics and archiving are facilitator-only. Database security rules
live in the repo, are deployed from it, and are reviewed in every plan that touches data.

### VI. Keys Never in Text, AI Only From a Server

Keys live in the macOS Keychain on the Mac and in host variables in the cloud; never in a `.env`,
commit, chat, log, screenshot or command argument. No secret is ever shipped to the browser: every
AI call runs on a server function with a spending limit. `docs/LLAVES.md` is kept current.

### VII. Noe Approves Money, Exposure and Production Data

Spending money, publishing anything to the internet, creating accounts or projects, changing
production security rules, and writing or migrating production data each need Noe's explicit yes,
named in the plan.

### VIII. Calm, Honest Interface

The interface follows Noe's global design rules: no «·» separators, no numbering for its own sake,
no left accent bars, no nested boxes, no hairline dividers as default structure, no repeated
information, shortcuts only in tooltips, one clear primary action per screen, and less text.
The interface never names the vendors it is built with. Content appears immediately; motion never
hides text for more than a moment and respects reduced-motion settings. Every list (sessions,
participants, answers) is designed for 1000 items: search, a dense view and scrolling that holds.

### IX. Simplest Thing, One Source of Truth

Before building, compare with the simplest alternative and only build what beats it. Each concept
(a participant, a session, the four circles, the step order) has one source of truth; everything
else is derived from it.

### X. Questions, Never Answers

Ikigapp MUST NOT give a person answers about themselves: no suggested items to add, no proposed
pairs or ikigai sentences, no interpretations, scores, labels or personality types. Its work is
asking the right question at the right moment, often with the person's own words. Any generated
text MUST be a question built from what the person wrote and MUST NOT contain a suggested answer.
Rationale: answers from an app influence people, and that is wrong (Noe, 2026-11-14).

## Stack and Constraints

- React 19, TypeScript, Vite and Tailwind CSS 4 single-page app; Spanish UI.
- Firestore (the existing project from February 2026, recovered) for sessions and participants;
  Firebase Authentication with Google for facilitators only.
- AI calls run in a server function on Vercel, with a spending limit; the browser never holds a key.
- Participants never need an account. The flow works for a live facilitated session and for one
  person alone, with the same steps.
- Firestore rules (`firestore.rules`) and indexes are versioned in the repo.

## Development Workflow

- Every change starts with a Linear ticket in project Ikigapp; every commit message carries its ID.
- Work happens in a worktree from `origin/main`; branches are pushed after every commit and merged
  to `main` as soon as a slice is verified.
- Files are staged by name, never with `git add -A`.
- Each slice ends with before and after screenshots on its Linear ticket.

## Governance

This constitution overrides other practices in this repo. Amendments are proposed in the same turn
a new standing rule appears, approved by Noe, and versioned: MAJOR for removing or redefining a
principle, MINOR for adding one, PATCH for wording. `/speckit-analyze` checks every plan against it;
a violation blocks implementation until the plan changes or the constitution is amended.

**Version**: 1.1.0 | **Ratified**: 2026-11-14 | **Last Amended**: 2026-11-14
