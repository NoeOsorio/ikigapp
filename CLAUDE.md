# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint across the project
- `npm run preview` — Preview production build locally

## Architecture

Ikigapp is a client-side React SPA (no backend) that guides users through an Ikigai self-discovery flow. All state lives in URL query parameters via **nuqs** — there is no server, database, or global state store.

### Flow / Routing

Routing is handled in `App.tsx` by reading query params (`session`, `name`, `step`):

1. **Join** (`pages/Join.tsx`) — No session or no name → create/join a session
2. **Lobby** (`pages/Lobby.tsx`) — Session + name, step=lobby → waiting area with QR code
3. **CategoryStep** (`pages/CategoryStep.tsx`) — Steps 1–4 → user enters items for each Ikigai category
4. **ActionStep** (`pages/ActionStep.tsx`) — Step 5 → user writes an action commitment
5. **Snapshot** (`pages/Snapshot.tsx`) — Step=snapshot → view/download/share result card

### State Management

All state is persisted in URL query parameters using `nuqs` (configured in `lib/nuqs.ts`):
- `session`, `name` — string params for session identity
- `step` — literal union: `lobby | 1 | 2 | 3 | 4 | 5 | snapshot`
- `c1`–`c4` — JSON-encoded string arrays (one per Ikigai category)
- `action` — free text for step 5
- `payload` — base64-encoded JSON containing the full snapshot data

### Design System

Japanese minimalist aesthetic with seasonal theming. CSS custom properties defined in `index.css`:
- Base palette: washi paper tones (`--color-bg`, `--color-ink`, `--color-accent`, etc.)
- Four seasonal palettes (`--season-spring-*`, `--season-summer-*`, etc.) mapped to steps 1–4
- Season variables are swapped at runtime via inline styles in `CategoryStep.tsx`
- Fonts: Noto Serif JP (display), Noto Sans JP (body)

### Key Libraries

- **nuqs** — URL query state (wraps React state in search params)
- **html2canvas** — Snapshot card export to PNG
- **qrcode.react** — QR code for session sharing
- **nanoid** — Session ID generation
- **Tailwind CSS v4** — Utility styling via `@tailwindcss/vite` plugin

## PR recommendations

<!-- Learnings from past PRs will be appended here by the /pr command -->
- When adding theme-dependent Tailwind classes in `Nav.tsx`, prefer a lookup map over nested ternaries to keep readability manageable as themes grow.
- Avoid duplicating utility functions across files; extract shared helpers (like `hasPayloadContent`) to `src/lib/`.
- Never commit asset filenames with spaces — rename before committing (e.g. `leaf-svgrepo-com (1).svg` → `leaf-momiji-svgrepo-com.svg`).
- Components using React context hooks must be rendered inside their corresponding Provider. If a route-level view needs context, wrap it in the Provider before rendering the inner component.
- Keep query param names consistent across all route helpers (`session` everywhere, not `id` in one and `session` in another).
- Avoid resolving the same data in both a parent and child component — pass it as a prop from the parent to prevent duplicated logic.
