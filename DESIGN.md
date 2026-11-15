# Design System: Ikigapp

Status: proposal for Noe's review (NOE-560). Nothing here is approved or built.

## 0. Why this direction

**Ikigapp is a personal tool for doing your ikigai consciously.** Anyone finds it and uses it on
their own: one day you sit down, give yourself time, and leave with something concrete (your
pairs, one sentence, your first steps). Workshops are only a way to hand out the same tool; each
person still does it privately and decides whether to share anything (Noe, 2026-11-14).

How it stays different from ikigaiapp.co, the large app in this space: that app is a daily
wellness companion (meditation, mood tracking, AI coach, cute characters, pastel skies). Ikigapp
is not daily and not a companion. It is **one deliberate exercise with a beginning, a middle and an
end**, done well, that you can revisit when your life changes.

Patterns it borrows, not looks:

- **Unpacking: recognize, don't recall.** People discover who someone is through ordinary objects.
  When you are stuck, Ikigapp offers everyday things to recognize instead of a blank question.
  ([Game Developer](https://www.gamedeveloper.com/design/telling-story-someones-belongings-unpacking))
- **Florence: joining feels physical.** Two of your answers fit together like pieces to form a
  pair. ([GamesBeat](https://gamesbeat.com/florence-uses-clever-interactions-to-create-a-relatable-mobile-game-about-romance/))
- **How We Feel: place it, don't describe it.** Choosing on a visual field is easier than writing
  a definition. ([Yale Medicine](https://medicine.yale.edu/news-article/the-how-we-feel-app-helping-emotions-work-for-us-not-against-us/))
- **Spotify Wrapped: the result is a story about you.** The ending is a short vertical sequence of
  cards that you may keep private or share. ([UX Collective](https://uxdesign.cc/why-is-spotify-wrapped-so-popular-5c503e79a3ee))
- **Jackbox and Mentimeter, only for workshops:** a short code to join, and a projected view of
  the room that never shows anyone's answers.
  ([Built In](https://builtin.com/articles/jackbox-games-design-party-pack),
  [Mentimeter](https://www.mentimeter.com/features/word-cloud))

## 1. Visual Theme & Atmosphere

A quiet desk with a good notebook and an hour for yourself. Unhurried, private, warm, with the
weight of something you will keep. Not a meditation app and not a game: the feeling of writing
in a well-made journal with a calm guide beside you.

- **Primary surface:** the phone and the laptop of one person. Equal care on both.
- **Secondary surface (workshops only):** a projector view for the facilitator, and a simple
  workshop page with the link, the QR and how many people finished.
- **Density:** 3 on the exercise (airy, one thing at a time), 6 on «Mis ikigais» and the workshop
  page.
- **Variance:** 6 (Offset Asymmetric). Left-aligned editorial type, nothing centered by default.
- **Motion:** 4 (Fluid CSS), calm; one rich moment at the end.
- **The ownable idea: your hanko runs through the whole exercise.** A hanko is a personal seal used
  in Japan to sign what is yours. At the start you make your seal (your initials, cut into a
  vermilion stamp shape). Every pair you form is stamped with it; your finished ikigai carries the
  full seal. The seal is the progress, the signature and the ending at once, with no numbers. No
  cherry blossoms, lanterns, seasons, kanji decoration, mascots or pastel skies.

## 2. Color Palette & Roles

One warm neutral family and one accent. Never pure black.

- **Paper** (#FAF8F5) — Background everywhere.
- **Sheet** (#FFFFFF) — Raised surfaces: the answer field, the cards of the result.
- **Ink** (#1C1A17) — Primary text and primary buttons.
- **Pencil** (#6B655C) — Secondary and helper text. At least 4.5:1 on Paper.
- **Wash** (#EFEBE4) — Grouping surfaces (your answers, a selected area) instead of borders.
- **Shu Vermilion** (#C8553D) — The single accent: the hanko seal, focus rings, the one primary
  moment per screen. Saturation 56%.
- **Signal Red** (#B3261E) — Errors only, always with text.

The four circles are **not** color-coded. They are told apart by a plain symbol and their name.

## 3. Typography Rules

- **Display:** Fraunces, set with its «Soft» and «Wonky» axes at high optical size — a serif with
  ink traps and a slightly hand-cut warmth, so the questions and your own sentence feel written,
  not typeset by a template. Weight 400 to 500, tracking -0.02em at large sizes. Chosen over the
  common Instrument Serif plus warm-bone recipe, which reads as generic.
- **Interface and body:** Geist — labels, buttons, lists, help. 16px minimum, line-height 1.5,
  60ch max.
- **Numbers:** Geist with tabular figures where counts update live (the workshop page).
- **Banned:** Inter; generic serifs (Times New Roman, Georgia, Garamond); Japanese display fonts as
  decoration; all-caps paragraphs.

## 4. The experience, surface by surface

- **Start:** one sentence about what you will get and how long it takes (about 30 to 45 minutes),
  one button «Empezar». The first thing you do is make your seal: type your initials and the stamp
  is cut in front of you. No account to start; the answers are saved and reachable from a private
  link, with an optional sign-in to keep several ikigais across devices.
- **The four circles, any order:** Lo que amas, Lo que haces bien, Lo que el mundo necesita, Por lo
  que te pagarían, each with a plain symbol, same size, same weight. You enter one, answer, come
  back, and see the others waiting. Leaving and returning days later is normal and expected.
- **Answering:** one question at a time in Fraunces; the field pinned at the bottom with
  voice; your answers appear above as Wash pills you can tap to edit.
- **«Si no se te ocurre»:** a row of Sheet cards with memory prompts («¿Qué hacías a los 10 años sin
  que nadie te lo pidiera?»), and a row of everyday objects to recognize (a guitar, a pan, a laptop,
  a ball); tapping one opens the field with «Con esto me gusta…».
- **Joining:** answers from two neighboring circles sit in two plain columns on Paper (no
  background box); the chosen answer of each turns Wash. Choose one of each and they come together
  into a pair (Pasión, Misión, Profesión, Vocación) with a proposed sentence you can rewrite; when
  you keep it, your seal stamps it. Opposite circles never pair.
- **Your sentence and first steps:** a calm page to write your ikigai in one sentence and one to
  three concrete steps for the next weeks.
- **The hanko result:** a vertical 9:16 sequence of cards (each pair, your sentence, your steps). The
  last card receives your vermilion seal. Private by default; you choose to download, share as
  images, or share a link.
- **Mis ikigais:** if you return months later you can make a new one and see past versions side by
  side; built for many versions with search and dates, never a feed.
- **Workshops (optional):** the projector view uses a dark theme (Ink background, Paper text) so it
  stays readable and does not glare in a lit room; nothing on it below 28px. The facilitator
  creates a workshop and gets a link and a QR. Each person
  does the same private exercise. The facilitator sees only how many people joined and finished,
  plus anonymous themes if enough people took part; a person's answers are visible to the
  facilitator only if that person chooses to share their result.

## 5. Component Stylings

- **Primary button:** Ink fill, Paper text, fully rounded, 56px tall on phone. Press scales to 0.97
  in 140ms. One per screen.
- **Secondary action:** text in Ink with an arrow, or a Wash pill. Never a second filled button.
- **Cards:** Sheet on Paper with a soft, warm shadow; only where elevation means «this is yours»
  (the result, a pair). No card inside a card.
- **Inputs:** label above, helper text in Pencil, error below in Signal Red with «Reintentar».
- **Loading:** skeletons matching the final layout; every load ends in content or a Spanish error
  within 15s.
- **Empty states:** show the first action, don't explain it.
- **Saving:** a quiet «Guardado» after a confirmed save; nothing looks saved before it is.

## 6. Layout Principles

- Left-aligned, asymmetric, generous; group by surface (Paper, Wash, Sheet) and space, not by lines.
- Phone: single column, the answer field reachable by the thumb, no hunting for the primary action.
- Laptop: the same flow in a centered reading column (max 680px) with room to breathe; «Mis
  ikigais» and the workshop page use the full width (max 1200px).
- Every screen works at 375px with no horizontal scroll; touch targets at least 44px.
- Lists (your versions, workshops, participants) have search and stay usable at 1000 items.

## 7. Motion & Interaction

Decided with Emil Kowalski's rules: fast for everyday UI, one rich moment.

- **Adding an answer:** the pill enters with opacity and a 4px rise, 180ms, strong ease-out. No
  animation when adding with Enter.
- **Joining:** the two chosen answers slide toward each other and the pair card settles with a
  soft spring (stiffness 100, damping 20), under 500ms.
- **Making your seal:** the initials are cut into the stamp with a short reveal (clip-path from
  the center, 400ms, ease-in-out); rare, once per ikigai.
- **Hanko:** each kept pair is stamped once, 220ms scale from 1.15 to 1 with a slight rotation,
  plus a short haptic on phones; the final card's full seal uses the same press, slightly slower
  (320ms). Tappable to skip.
- **Projector (workshops):** finished counts update with a gentle number roll.
- **Reduced motion:** opacity only; the seal appears without the press.
- Only transform and opacity are animated. No perpetual animation on the personal exercise.

## 8. Anti-Patterns (Banned)

- Cherry blossoms, lanterns, seasons, kanji as decoration, pastel skies, mascots, cute characters.
- Daily streaks, reminders that nag, mood tracking, meditation: Ikigapp is not a daily companion.
- Color-coding the four circles.
- More than one accent; pure black; neon or outer glows; gradient text.
- Inter; generic serifs; emojis anywhere.
- The middle dot «·» as a separator, anywhere.
- Numbering for its own sake (Paso 1, 01/02, x de y) unless the number is the information.
- Colored or gray accent bars on the left edge of anything.
- Boxes inside boxes inside cards; hairline dividers as default structure.
- The same information twice on one screen; keyboard shortcuts printed on the surface.
- Vendor or model names in the interface.
- Centered hero layouts; three equal cards in a row; «Scroll to explore» or bouncing arrows.
- Generic names and fake round numbers in mockups; realistic Spanish names and odd counts.
- AI copy clichés and their Spanish equivalents («potencia», «desbloquea», «transforma tu vida»).
- Anyone's answers shown to another person without that person choosing to share them.
