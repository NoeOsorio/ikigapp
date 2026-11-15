# Feature Specification: Revive Ikigapp

**Feature Branch**: `noe-560-revive`

**Created**: 2026-11-14

**Status**: Draft

**Input**: User description: "Revive Ikigapp (github.com/NoeOsorio/ikigapp) until real people can use it: live
ikigai workshops and people doing it alone." Linear: NOE-560.

## What exists today (diagnosis, 2026-11-14)

Evidence and screenshots live on NOE-560.

- **Nobody can get in.** Creating or joining a session shows «No se pudo unir a la sesión»; the
  database answers `Missing or insufficient permissions` to every read and write. Statistics show
  that raw English error. Likely cause: test-mode database rules that expired; the rules were never
  in the repo.
- **It fails silently.** After the failed join, the lobby still lists the person as «Tú, en el
  lobby» and the four circles accept answers that stay only in that browser. The summary page
  stays on «Cargando…» forever.
- **The AI summary can never appear.** The summary request asks for JSON output without mentioning
  JSON, which the AI service rejects; the error is swallowed.
- **The AI key was shipped to the browser.** Anyone could copy it. It now lives in the Keychain and
  is not injected into any build.
- **A typed name is the identity.** Two people with the same name share one record; typing someone's
  name lets you read or overwrite their answers; statistics and archiving are open to anyone, and
  every participant sees the statistics button.
- **Does not scale.** Statistics download every participant of every session into the browser.
- **Slow, low-contrast first paint.** Landing and join show almost nothing for over 3 seconds while
  an entrance animation plays; the background kanji covers the title on phones.
- **What works:** the build compiles; the four circles can be filled; drafts survive in the browser.
- **Not seen working** (behind the locked database): lobby with others, intersections, ikigai
  statement and actions, result card, PDF, per-session statistics.

## Noe's decisions (2026-11-14)

- **Audience:** live facilitated workshops and people alone, one flow with two entry points.
- **Access:** facilitators sign in with Google; participants never create an account and get an
  unguessable private link. Statistics are facilitator-only.
- **AI:** kept, called only from a server with a spending limit; the key never reaches the browser.
- **Database:** recover the February project and its past workshops.

## Visual identity (Noe 2026-11-14)

Japanese, warm and alive, without seasons. A flat "botanical" proposal was rejected for dropping the
Japanese identity; a later four-seasons structure was dropped because seasons are sequential and the
ikigai circles are not (Noe: «quitarlas»).

- Shippori Mincho for headings, DM Sans for text; warm dawn paper as the ground, matcha for the card.
- Each zone keeps a soft color of its own (rose, green, blue, amber), used only to tell zones apart;
  none is brighter or bigger than another.
- Japanese elements that carry meaning: the garden, the stone lantern (the ikigai), sakura, ink.
- No seasonal kanji, no season names, no season order anywhere in the interface.

## Core concept: your ikigai is a garden you tend (Noe 2026-11-14)

The four circles exist at the same time and none is more important than another. Paper page «Jardín,
juntar respuestas».

- **Four equal zones around a center**, each with a plain symbol anyone understands: Corazón (lo que
  amas), Manos (lo que haces bien), Mundo (lo que el mundo necesita), Moneda (por lo que te
  pagarían). Same size, no order, no «step one»; the person tends any zone in any order.
- **Garden life grows per answer** in each zone: blossoms (Corazón), stones and moss (Manos), water and
  koi (Mundo), sprouts and harvest (Moneda).
- **Joining is the core gesture.** The person joins one of their own answers with one from an
  adjacent zone; the pair forms with a proposed sentence they can edit, then is planted on the border
  between both zones. Pairs follow everyday Spanish: Corazón + Manos = Pasión («hacer algo con el
  corazón»), Corazón + Mundo = Misión, Manos + Moneda = Profesión («ganarse la vida con las manos»),
  Mundo + Moneda = Vocación. Opposite zones never pair, as in the ikigai diagram.
- **The ikigai is the stone lantern in the center**, lit when the four pairs exist; the final card
  shows the lit garden and the person's sentence.

## Help inside each zone (Noe: «super cozy, que te anime a responder, una app viva»)

- **One question at a time, like a conversation**, with the answer field always at hand.
- **«Si no se te ocurre, pregúntate»:** curated memory prompts in Spanish, at least eight per zone,
  that open the field with the start of an answer when tapped.
- **Ideas you can tap:** suggestions based on what the person already wrote, added with one tap.
- **Live connections:** when an idea shows up in two adjacent zones, a warm note points it out
  («Enseñar aparece también en lo que amas. Ahí puede estar tu pasión»), inviting the join.
- **Answer by voice:** a microphone next to the field; speech is transcribed in the cloud.
- **The workshop garden:** a projector view where each participant's garden grows as they answer; no
  names or answers are shown.

Decisions this adds for Noe: AI cost per participant for suggestions, live connections and proposed
pair sentences, and voice transcription cost (both cloud services with a spending limit).

## Motion (decided with Emil Kowalski's design-engineering rules)

- A new blossom, stone, koi or sprout grows into its zone when an answer is added: scale from 0.6
  with opacity, about 320 ms on a soft spring; plays once per answer.
- Joining: the two chosen answers draw toward each other along a short thread, and the pair blooms on
  the border with the same growth motion; under 600 ms.
- The lantern lights with a warm glow that fades in over about 800 ms the first time all four pairs
  exist; this rare moment may linger, and is skippable by tapping.
- A few sakura petals drift across the garden: decorative, linear drift with gentle sway, paused when
  the tab is hidden, static under `prefers-reduced-motion`; never over text.
- Text and inputs are visible on first paint; no entrance animation may hide content (today it hides
  it for more than 3 s).
- Answer chips enter with opacity and a 4 px rise, 180 ms, strong ease-out, interruptible transitions.
- Buttons scale to 0.97 on press, 140 ms ease-out. Nothing animates from scale 0.
- No animation on keyboard actions (adding an answer with Enter).

## Acceptance bar (what a good result looks like)

On a phone, a participant scans the facilitator's QR, types their name, and within a minute is
answering the first circle. Every answer is saved where the facilitator can see it, or the person is
told plainly that it was not. After the fourth circle they see four intersections written for them,
write their own ikigai sentence and at least one action, and leave with a card they can download and
reopen later from their private link on any device. The facilitator sees who joined, who is on which
step and who finished, live, and the session's statistics, all from their own account.

It must NOT contain: any screen that looks saved when it is not; any spinner that never ends;
another person's answers reachable by guessing a name or link; English error text; vendor names;
the «·» separator; numbered steps for their own sake; text hidden behind an animation for more
than a moment.

### Real cases (end-to-end checks)

1. **A 30-person workshop.** Facilitator signs in, creates a session, projects the QR. 30 phones
   join within two minutes, including two people both named «Ana López». Each sees only their own
   answers; the facilitator's lobby shows 30 distinct people with their step.
2. **A person alone at night.** Someone opens the landing, taps the solo entry, completes all four
   circles, closes the tab at the third, reopens their private link the next day on another device,
   and continues where they stopped.
3. **AI unavailable.** The AI service is down or the spending limit is reached during a workshop.
   Participants see a calm message, can write their intersections themselves, and still finish
   with a complete card.
4. **The facilitator after 50 workshops.** Their workshop list holds 50 sessions and 1,000
   participants; they find last Tuesday's session by name or date in seconds and open its statistics.
5. **A curious participant.** A participant edits the URL to another person's name or id, or opens
   the statistics address. They see nothing of anyone else.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A participant completes their ikigai in a live workshop (Priority: P1)

A participant joins from the facilitator's QR or link with just a name, fills the four circles,
receives four intersections, writes an ikigai sentence and actions, and gets a result card with
download, all saved and reachable later from their private link.

**Why this priority**: This is the product. Today nobody can get past the first screen.

**Independent Test**: With one facilitator-created session, complete the whole flow on a phone,
reload at each step, reopen the private link on a second device, and confirm the answers are there
and the facilitator can see them.

**Acceptance Scenarios**:

1. **Given** an open session, **When** a person enters a name and joins, **Then** they reach the
   first circle and the facilitator's lobby lists them within 5 seconds.
2. **Given** two participants type the same name, **When** both join, **Then** they are two
   separate people whose answers never mix.
3. **Given** a participant mid-flow, **When** they reload or reopen their private link elsewhere,
   **Then** they resume at the same step with all answers.
4. **Given** the database rejects a save, **When** the participant continues, **Then** they see a
   plain Spanish message and a retry, and the app never shows the answer as saved.
5. **Given** four filled circles, **When** the intersections step opens, **Then** four
   personal intersections appear, or a clear message plus the option to write them by hand.
6. **Given** a finished participant, **When** they open their card, **Then** they see their
   answers, intersections, ikigai sentence and actions, and can download it as a PDF.

---

### User Story 2 - A facilitator runs and reviews workshops (Priority: P1)

A facilitator signs in with Google, creates a session, shows the QR, watches participants join and
progress live, and afterwards reviews each session's statistics and each participant's card from
their own workshop list.

**Why this priority**: Without a protected facilitator space, the privacy problems remain and no
workshop can be run responsibly.

**Independent Test**: Sign in, create a session, join it from two phones, watch the lobby update,
finish one participant, open the statistics; then sign in as a different Google account and confirm
none of that is visible.

**Acceptance Scenarios**:

1. **Given** a signed-in facilitator, **When** they create a session, **Then** they get a QR and a
   short link they can project, and the session appears in their list.
2. **Given** a running session, **When** participants join and advance, **Then** the facilitator
   sees each person and their current step live.
3. **Given** a facilitator with many sessions, **When** they search by name or date, **Then** the
   list narrows instantly and holds up with 1000 sessions.
4. **Given** someone who is not that session's facilitator, **When** they open its statistics or
   archive address, **Then** they see nothing and can do nothing.

---

### User Story 3 - A person does their ikigai alone (Priority: P2)

From the landing page, a person starts on their own without a facilitator or session code and gets
the same flow, saved under their private link.

**Why this priority**: Noe chose both audiences; the solo path reuses the same flow, so it is cheap
once Story 1 works.

**Independent Test**: From the landing, start alone, finish the flow, and reopen the private link
on another device.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** a person chooses to start alone, **Then** they enter their
   name and reach the first circle without a session code.
2. **Given** a solo person, **When** they finish, **Then** their card is the same as a workshop
   participant's, without facilitator or lobby elements.

---

### User Story 4 - AI intersections and summary that work and cost little (Priority: P2)

The four intersections and the ikigai summary are generated on a server, in Spanish, specific to
the person, once per participant, within a spending limit; when unavailable, the person writes
them with guiding questions.

**Why this priority**: The AI is what makes the session feel personal, but the flow must never
depend on it.

**Independent Test**: Run the flow with the AI available and with it disabled; both end in a
complete card. Check that no key appears in the browser's downloaded files.

**Acceptance Scenarios**:

1. **Given** four filled circles, **When** intersections are requested, **Then** they arrive in
   under 10 seconds, each one naming something the person actually wrote.
2. **Given** a participant whose intersections were already generated, **When** they reload,
   **Then** no new AI request is made.
3. **Given** the AI service fails or the limit is reached, **When** the step opens, **Then** the
   person sees a calm Spanish message and fields to write each intersection themselves.

---

### User Story 5 - Recover the February workshops (Priority: P3)

Past sessions and participants in the recovered database remain readable under the new rules and
data shape, assigned to Noe's facilitator account.

**Why this priority**: They are the fixed exam for AI quality and Noe's history, but new workshops
matter more.

**Independent Test**: After migration, Noe's workshop list shows the February sessions with their
participants and cards.

**Acceptance Scenarios**:

1. **Given** sessions created before accounts existed, **When** Noe signs in, **Then** they appear
   in his list with their participants.
2. **Given** an old participant without intersections, **When** their card opens, **Then** it shows
   what they did answer, without errors.

---

### Edge Cases

- A participant loses connection mid-circle: answers queue and the person sees they are not saved
  yet; nothing is shown as saved until it is.
- A session code that does not exist or was archived: a plain message, not a blank screen.
- A facilitator closes their laptop during the workshop: participants keep working.
- 150 participants in one session: the lobby stays readable (dense list, search) and live.
- Very long answers or 30 items in one circle: layout and PDF hold.
- Reduced-motion setting: no entrance animations; content visible at once.
- A participant opens an old link in the `?name=` format: they are sent to join, not shown anyone's data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Participants MUST join a session with only a display name, no account.
- **FR-002**: Each participant MUST receive a unique, unguessable private link that reopens their
  progress on any device; identity MUST NOT be derived from the typed name.
- **FR-003**: Facilitators MUST sign in with Google to create sessions, see their lobby, statistics,
  participants' cards, and archive sessions.
- **FR-004**: A participant's answers MUST be readable only by that participant (via their link) and
  by the session's facilitator; statistics and archiving MUST be facilitator-only.
- **FR-005**: Every save MUST be confirmed by the database before the interface shows it as saved;
  failures MUST show a plain Spanish message with a retry.
- **FR-006**: Every loading state MUST end in content or in an error within 15 seconds.
- **FR-007**: The facilitator's lobby MUST show participants and their current step live.
- **FR-008**: People MUST be able to complete the flow alone, without a session.
- **FR-009**: Intersections and the ikigai summary MUST be generated on a server, once per
  participant, in Spanish, with a spending limit; no secret MUST ever reach the browser.
- **FR-010**: When AI is unavailable, participants MUST be able to write intersections themselves
  and still finish.
- **FR-011**: The result card MUST show answers, intersections, ikigai sentence and actions, and
  download as a PDF.
- **FR-012**: Facilitator lists (sessions, participants) MUST offer search and a dense view and
  remain usable at 1000 items; statistics MUST be computed per session, not by downloading all
  participants of all sessions.
- **FR-013**: Database security rules MUST be versioned in the repo and deployed from it.
- **FR-014**: The February sessions and participants MUST remain readable and be assigned to Noe's
  facilitator account.
- **FR-015**: The interface MUST follow the constitution's design rules (no «·», no vendor names,
  no hidden text behind animations, reduced motion respected) at 375 px and desktop widths.
- **FR-016**: Old links (`/workshop?session&name`, `/result?session&name`) MUST NOT reveal anyone's
  answers; they lead to joining or to the participant's own link.

### Key Entities

- **Facilitator**: a signed-in person; owns sessions.
- **Session**: a workshop with a short code, a name, a date, its facilitator, and an archived flag.
  Solo runs have no session.
- **Participant**: a display name, a private secret link, the current step, and their answers;
  belongs to at most one session.
- **Answers**: the four circles (lists of items), four intersections (generated or self-written),
  the ikigai sentence, one or more actions, and the AI summary.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a rehearsal with at least 10 phones, every participant reaches the first circle
  within 60 seconds of scanning the QR.
- **SC-002**: Zero answers are shown as saved without being stored (checked by cutting the
  connection mid-flow in the rehearsal).
- **SC-003**: Zero cases where one participant can see another's answers, across all five real
  cases above.
- **SC-004**: 100% of participants who reach the intersections step end with a complete card, with
  AI on and with AI off.
- **SC-005**: Intersections appear in under 10 seconds in 9 of 10 runs; AI cost per participant
  stays under US$0.01.
- **SC-006**: Landing and join show readable content within 1 second on a phone.
- **SC-007**: A facilitator finds a given session among 1000 in under 10 seconds.
- **SC-008**: Independent reviewers (usefulness, clarity, design) score each main screen at least
  4 of 5.

## Assumptions

- The February Firebase project can be recovered by Noe; if not, a new project is created with the
  same rules and the history is lost (his call at that time).
- Hosting the app and the AI function on Vercel's free tier is enough for workshops of up to a
  few hundred people; Noe approves the deploy and the AI spending limit.
- The AI vendor stays the current one unless the plan shows a cheaper or better option; the
  interface never names it.
- Content is four guiding questions plus a short help text per circle, taken from the existing
  landing page's step descriptions; no external dataset is needed.
- Spanish only for this revival.
- Out of scope: participant accounts and history across workshops, payments, other languages,
  native apps, email delivery of cards.
