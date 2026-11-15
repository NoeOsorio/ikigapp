# Design System: Ikigapp

Status: proposal for Noe's review (NOE-560). Nothing here is approved or built.

## 0. Why this direction

**Ikigapp is a quiet moment with yourself.** Anyone finds it and uses it on their own: one day you
sit down, breathe, and answer the right questions until your ikigai takes shape in your own words.
It feels like meditation and introspection. You are not talking to an app; through it, you are
talking to yourself (Noe, 2026-11-14).

Two principles carry everything:

- **It asks, it never answers.** Ikigapp never suggests what you love, never proposes your pairs,
  never writes your sentence, never interprets or rates you. Answers given by an app influence
  people, and that is wrong. Its whole craft is asking the right question at the right moment,
  often with your own words.
- **It breathes with you.** The app has a slow, visible breath you can follow. Its calm becomes
  yours, and from that calm it says, without saying it: everything is fine, you are unique, and who
  you are is fine.

Workshops are only a way to hand out the same tool: each person does it privately and decides
whether to share anything.

How it stays different from ikigaiapp.co, the large app in this space: that app is a daily wellness
companion (meditation library, mood tracking, an AI coach that talks back, cute characters, pastel
skies). Ikigapp is **one deliberate exercise with a beginning, a middle and an end**, that you can
revisit when life changes, where the only voice that gives answers is yours.

Patterns it borrows, not looks:

- **Paced breathing near six breaths a minute.** Slowing breathing to about 0.1 Hz raises heart rate
  variability, with real but modest effects; the best pace varies from person to person, roughly 4.5
  to 7 breaths a minute. ([Sevoz-Couche and Laborde, 2022](https://hal.sorbonne-universite.fr/hal-03578368/file/Sevoz-Couche%20et%20Laborde%20-%202022%20-%20Heart%20rate%20variability%20and%20slow-paced%20breathingwh.pdf),
  [Springer, 2023](https://link.springer.com/article/10.1007/s10484-023-09582-6))
- **Apple Watch Breathe: a shape that expands as you inhale.** It guides an intended pace, it does
  not measure you, and it lets the person choose the rate.
  ([Wareable](https://www.wareable.com/smartwatches/how-to-use-apple-watch-breathe-app-6661),
  [Sano Labs](https://www.sanolabs.eu/blog/apple-watch-mindfulness-hrv/))
- **Unpacking: ordinary objects open memories.** Here, as questions about the things around you,
  never as suggested answers.
  ([Game Developer](https://www.gamedeveloper.com/design/telling-story-someones-belongings-unpacking))
- **Florence: bringing two things together feels physical.** Two of your answers come together
  where a pair is born. ([GamesBeat](https://gamesbeat.com/florence-uses-clever-interactions-to-create-a-relatable-mobile-game-about-romance/))

## 1. Visual Theme & Atmosphere

A quiet room in the early morning, a good notebook, a breath that slows down. Unhurried, private,
warm. Nothing competes for attention; there is always one thing on screen.

- **Primary surface:** one person's phone or laptop, with equal care.
- **Secondary surface (workshops only):** a workshop page with the link and QR, how many joined
  and finished; a dark projector view.
- **Density:** 2 on the exercise (one question, lots of air), 6 on «Mis ikigais» and the workshop
  page.
- **Variance:** 5. Left-aligned text, the breathing seal as the one centered element.
- **Motion:** slow and continuous at the center (the breath), still everywhere else.
- **The ownable idea: your hanko, carved by your own words, breathing.** A hanko is a personal seal
  used in Japan to sign what is yours. Yours starts as an uncarved block of stone that breathes with
  you. Each circle you complete carves one stroke into it, shaped by what you wrote, so no two seals
  are alike. Each pair you write deepens the carving where its two strokes meet. When your ikigai is
  done, the seal is pressed onto your sheet in vermilion ink. No cherry blossoms, lanterns, seasons,
  kanji decoration, mascots or pastel skies.

## 2. Color Palette & Roles

One warm neutral family and one accent. Never pure black.

- **Paper** (#FAF8F5) — Background everywhere.
- **Sheet** (#FFFFFF) — Raised surfaces: the answer field, the signed sheet.
- **Ink** (#1C1A17) — Primary text and primary buttons.
- **Pencil** (#6B655C) — Secondary and helper text, at least 4.5:1 on Paper.
- **Wash** (#EFEBE4) — Grouping surfaces instead of borders.
- **Stone** (#D9D2C5) — The uncarved seal block and its carved strokes.
- **Shu Vermilion** (#C8553D) — The single accent: the pressed seal, focus rings, the one primary
  moment per screen. Saturation 56%.
- **Signal Red** (#B3261E) — Errors only, always with text.

The four circles are **not** color-coded; they are told apart by a plain symbol and their name.
The projector view inverts to Ink background and Paper text.

## 3. Typography Rules

- **Display:** Fraunces with its «Soft» and «Wonky» axes at high optical size, weight 400 to 500,
  tracking -0.02em at large sizes: the questions, your words reflected back, your sentence.
- **Interface and body:** a humanist sans, chosen by showing Noe two candidates on real screens (for
  example Instrument Sans and Hanken Grotesk). 16px minimum, line-height 1.5, 60ch max, tabular
  figures where counts update live.
- **Banned:** Inter, Geist as a default, generic serifs (Times New Roman, Georgia, Garamond),
  Japanese display fonts as decoration, all-caps paragraphs.

## 4. Voice

- Second person, «tú», short sentences, warm and plain. Questions end in a question mark and leave
  room; no exclamation marks, no praise, no grading («¡Excelente respuesta!» is banned).
- The app reflects your words, it does not add its own: «Escribiste “enseñar”. ¿Qué parte de enseñar
  es la que disfrutas?».
- No therapy jargon, no mystical vocabulary, no affirmation stream. One quiet sentence of acceptance
  at the very end is enough: «No hay otro sello como el tuyo.»

## 5. The experience, surface by surface

- **Start:** one sentence about what this is and how long it usually takes (about 30 to 45 minutes,
  in one sitting or several), one button «Empezar». No account needed; a private link keeps your
  ikigai, with optional sign-in to keep several across devices.
- **Arriving: breathe together.** Before the first question, the uncarved seal breathes on its own
  and invites you: «Respira con ella.» Three breaths, then the first question appears. «Saltar» is
  always visible. The same arrival happens every time you come back.
- **The breathing center:** on every exercise screen the seal block keeps breathing slowly at the
  top. While you type or speak, it settles and nearly stops, so it never competes with your thoughts;
  when you pause, it resumes.
- **The four circles, any order:** Lo que amas, Lo que haces bien, Lo que el mundo necesita, Por lo
  que te pagarían, each with a plain symbol, same size, same weight. You enter one, answer, come
  back. Leaving and returning days later is expected.
- **Answering:** one question at a time in Fraunces; the field pinned at the bottom with voice; your
  answers appear above as Wash pills you can tap to edit. After you add one, the next question often
  uses your own words to go one layer deeper. Those follow-up questions may be generated, but only
  as questions, built from your words, never containing suggested answers.
- **«Si no se te ocurre»:** more questions, not answers: memory prompts («¿Qué hacías a los 10 años
  sin que nadie te lo pidiera?») and object prompts («¿Qué objeto de tu casa usas sin que nadie te lo
  pida?»). There is no list of things to tap and add.
- **Joining, where a pair is born:** your answers from two neighboring circles sit in two plain
  columns; choose one of each and they come together. Ikigapp asks one question at their meeting
  point («¿Qué pasa en ti cuando enseñas algo que te sale natural?») and you write the pair in your
  words. When you keep it, its stroke deepens on your seal. Opposite circles never pair.
- **Your sentence and first steps:** a calm page where you write your ikigai in one sentence and one
  to three concrete steps for the next weeks. Ikigapp asks («Si lo dijeras en una sola frase, ¿cómo
  sería?»); it never drafts it for you.
- **Pausing:** «Pausar» is always one tap away and opens a breathing screen with the seal and
  «Vuelve cuando quieras.»
- **Coming back:** «Donde lo dejaste»: the arrival breath, your seal as it is, the circle you were
  in, one button to continue. No streaks; at most one reminder the person asks for.
- **The signed sheet:** one sheet, made to be printed or framed: your sentence large, your four pairs,
  your first steps, all in your words, and your seal pressed at the bottom, then «No hay otro sello
  como el tuyo.» Private by default; a PDF or a single image to share are derived from it.
- **Mis ikigais:** past versions side by side with their seals, so you can see how you changed;
  search and dates, never a feed.
- **Workshops (optional):** the facilitator creates a workshop and gets a link and a QR. Each person
  does the same private exercise. The facilitator sees how many joined and finished; answers are
  visible only if a person chooses to share their sheet. The projector view is dark (Ink background,
  Paper text, nothing below 28px) and can show one large breathing seal to open the session with the
  whole room breathing together.

## 6. Component Stylings

- **Primary button:** Ink fill, Paper text, fully rounded, 56px tall on phone; press scales to 0.97
  in 140ms. One per screen.
- **Secondary action:** text in Ink with an arrow, or a Wash pill. Never a second filled button.
- **The seal:** a squared, slightly rounded stone block in Stone, about 96px on the exercise screens
  and 160px on arrival and pause; carved strokes are recessed lines; the pressed version is
  vermilion ink with uneven edges.
- **Cards:** only the signed sheet and a kept pair are raised (Sheet on Paper, soft warm shadow). No
  card inside a card.
- **Inputs:** label above, helper text in Pencil, error below in Signal Red with «Reintentar».
- **Loading:** skeletons that match the final layout; every load ends in content or a Spanish error
  within 15s. No spinners.
- **Saving:** a quiet «Guardado» after a confirmed save; nothing looks saved before it is.

## 7. Layout Principles

- Left-aligned text, generous space, one thing at a time; group by surface (Paper, Wash, Sheet) and
  space, never by lines.
- Phone: single column, the seal at the top, the question in the middle, the answer field reachable
  by the thumb.
- Laptop: the same flow in a reading column (max 680px); «Mis ikigais» and the workshop page use the
  full width (max 1200px).
- Every screen works at 375px with no horizontal scroll; touch targets at least 44px.
- Lists (your versions, your answers in a circle, workshops) have search and stay usable at 1000
  items.

## 8. Motion & Interaction

Decided with Emil Kowalski's rules: everyday UI is fast and quiet; the breath is the one continuous
motion, and it exists because it has a purpose (pacing the person's own breathing), not as decoration.

- **The breath:** the seal scales from 1.00 to 1.04 while its soft shadow widens, then returns.
  Default pace 6 breaths a minute (5s in, 5s out) with ease-in-out, because it is on-screen movement;
  the person can choose slower or faster (4 to 8 a minute) in settings. Implemented as a CSS
  animation on transform and opacity only, so it stays smooth while the page is busy.
- **Arrival breathing:** three breaths at the same pace, with «Inhala» and «Exhala» fading in and out
  in step; then the question fades in over 400ms. Skippable.
- **While typing or speaking:** the breath eases to near stillness over 1s and resumes after a few
  seconds of silence.
- **Adding an answer:** the pill enters with opacity and a 4px rise, 180ms, strong ease-out; no
  animation when adding with Enter.
- **Carving:** completing a circle carves its stroke with a reveal along the stroke (clip-path,
  400ms, ease-in-out); keeping a pair deepens the meeting point in 240ms.
- **Pressing the seal:** at the end the seal presses onto the sheet once, 320ms scale from 1.15 to 1
  with a slight rotation; tappable to skip.
- **Haptics:** on phones that allow it from the web, a very soft pulse at the start of each inhale
  during arrival; iPhone browsers do not allow web vibration, so there it is visual only.
- **Sound:** none by default; an optional quiet tone at the turn of each breath.
- **Reduced motion:** the seal does not scale; «Inhala» and «Exhala» alternate as text with opacity
  only; carving and pressing appear without movement.

## 9. Anti-Patterns (Banned)

- Any answer given by the app: suggested items to add, proposed pairs or sentences, summaries that
  interpret the person, scores, labels or personality types.
- Praise, grading, exclamation marks, streaks, countdowns, timers on questions.
- Cherry blossoms, lanterns, seasons, kanji as decoration, pastel skies, mascots, cute characters.
- Daily-companion features: mood tracking, meditation libraries, nagging reminders.
- Color-coding the four circles.
- More than one accent; pure black; neon or outer glows; gradient text.
- Inter; Geist as a default; generic serifs; emojis anywhere.
- The middle dot «·» as a separator, anywhere.
- Numbering for its own sake (Paso 1, 01/02, x de y) unless the number is the information.
- Colored or gray accent bars on the left edge of anything.
- Boxes inside boxes inside cards; hairline dividers as default structure.
- The same information twice on one screen; keyboard shortcuts printed on the surface.
- Vendor or model names in the interface.
- Centered hero layouts other than the seal; three equal cards in a row; «Scroll to explore».
- Generic names and fake round numbers in mockups.
- AI copy clichés and their Spanish equivalents («potencia», «desbloquea», «transforma tu vida»).
- Anyone's answers shown to another person without that person choosing to share them.
