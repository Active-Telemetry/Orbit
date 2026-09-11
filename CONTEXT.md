# Orbit — Context & Handoff Notes

A study app for NCEA Level 1 (NZ) subjects, built for a specific student.
Currently: the four NCEA science-strand subjects (Biology, Chemistry,
Physics, Earth & Space) — see "Current state" for how these used to be
bundled under a single "Science" subject and were flattened out in
v0.6.0. Designed so more subjects can be added later without
restructuring.

This file exists so a new chat can pick up work without re-deriving the
decisions below. Read this before touching `app.jsx`.

## Current state

- **Version:** 0.9.0 (in `APP_VERSION` in `app.jsx`, and matching
  `CACHE_NAME` in `sw.js`)
- **v0.9.0 tightened the Physical Properties module** (Chemistry) the
  same way as the v0.8.0 genetics pass below, but content-complete
  already (no missing concepts vs. the source file this time) — just
  wordy. All 6 `prop-*` submodules' `learn` facts were split from dense
  multi-sentence bodies into short, single-idea parent/child facts,
  questions left untouched. Verified post-edit: average fact body ~17
  words, longest 32 words — down from ~38 words average and several
  45–61-word single facts beforehand. Also closed one small pre-existing
  content gap while in there: added a "metals generally have high
  melting points" fact to `prop-metallic` (a related question already
  existed, `prop_q23`, but nothing taught it explicitly).
- **v0.8.0 expanded and tightened the Genetics & Variation module**
  (Biology), reviewed against `content/92022_NCEA_L1_CB1.3_Genetics_and_Variation.txt`:
  added a new `gen-population` submodule (mating patterns, migration,
  allele frequencies — genuinely missing before, not just thin), added
  phylogenetic trees to `gen-tracking` and carrier-status/sickle-cell to
  `gen-basics` (both named as tracking/example concepts in the source
  but absent from the app), and added 10 new questions (`gen_q17`–`gen_q26`)
  across all five submodules. Every existing `learn` fact body was also
  rewritten shorter — multi-sentence, multi-concept bodies were split
  into separate one-idea facts (parent/child nodes) rather than trimmed
  in place, since the v0.7.0 Learn-mode stepper now shows one fact per
  screen and long paragraphs are much more noticeable there than they
  were in the old accordion. Verified post-edit: average fact body is
  ~15 words, longest is 26 words (one sentence) — down from several
  40–50-word, 2–3-sentence bodies beforehand.
- **v0.7.0 turned Learn mode into an interleaved fact→question
  stepper.** It used to be a static expandable accordion
  (`LearnNode`/`teaser`, both now deleted) showing all of a submodule's
  `learn` tree at once. Now `LearnScreen` walks through one step at a
  time — a short fact, then zero or more of the submodule's `questions`
  (the same question objects/bank Revise uses, answered inline with
  identical immediate feedback), then Continue to the next fact.
  - **Pairing is automatic, not hand-authored.** There's still no data
    field linking a specific fact to a specific question (facts and
    questions are two independent arrays per submodule, sharing only a
    `band` tag) — `collectFactsByBand()` buckets `learn` nodes by band
    via a depth-first walk, `distributeQuestions()` spreads that band's
    questions across that band's facts as evenly as possible
    (`ceil(i·Q/F)` slice boundaries), and `buildLearnSteps()` composes
    both into the flat step list `LearnScreen` steps through. This
    recomputes fresh from whatever's in `SUBJECTS` every time — nothing
    is persisted about the pairing, so it needs zero upkeep as content
    is added/changed, though *which* fact a given question lands under
    can shift when nearby content changes (harmless, since nothing
    depends on that).
  - **Fact:question ratio is skewed, unevenly, per band** — this is
    exactly why an even-distribution formula was needed rather than
    naive 1:1 pairing: band 1 has few facts but many questions per
    submodule (e.g. `atoms-bonding`: 1 fact, 6 questions — all 6 show as
    consecutive question-steps after that one fact), band 2 has many
    facts but often *zero* questions (e.g. `cells-basics`: 4 facts, 0
    questions — those facts just show with a plain Continue button, no
    question step), band 3 is close to 1:1.
  - **Learn-mode answers do NOT touch `state.progress`/`questionStats`.**
    Revise remains the only assessed mode. Learn keeps a local,
    non-persisted tally (`results` component state) shown as an
    informal recap ("N of M correct... this didn't change your
    proficiency score") at the end of the walkthrough. `SCHEMA_VERSION`
    did NOT need to bump for this — nothing about the progress shape
    changed, unlike the v0.6.0 flatten below.
  - `styles.learnNodeBtn` (a clickable accordion row) was renamed to
    `styles.learnFactCard` (a static card) since the new fact display
    isn't a button.
- **v0.6.0 flattened the subject hierarchy:** the old single `science`
  subject wrapping four areas (Biology, Chemistry, Physics, Earth &
  Space) as a middle layer is gone. Each former area is now its own
  top-level entry in `SUBJECTS` — Home lists Biology/Chemistry/Physics/
  Earth & Space directly, and tapping one goes straight to that
  subject's module list (no more intermediate "choose an area" screen).
  See "Data model" below for the new shape. `SCHEMA_VERSION` bumped to
  `2` and `loadState`/`handleImport` run a one-time `migrateProgress()`
  step that pulls old `progress.science.<areaId>.*` data back out to
  `progress.<areaId>.*` so existing saved progress isn't lost.
- **Live now:** Biology, Chemistry, Physics, Earth & Space as four
  top-level subjects (content counts below are from before the v0.5.0
  Physical Properties/genetics passes and the v0.6.0 flatten — see the
  "Stale note" under Content coverage).
- **Two parallel copies of the app exist** — see "Two builds" below.
  They should be kept in sync by hand; there's no shared source yet.
  **Note:** this may itself be stale — only a single `app.jsx` exists at
  the repo root as of this writing, not a `pwa/` folder plus
  `study-app.jsx`; worth confirming next time this section is touched.

## Two builds

1. **`study-app.jsx`** (outside the `pwa/` folder) — the version used as
   a Claude.ai sandbox artifact for live preview during development.
   Uses `lucide-react` icons and ES module imports. **State is
   in-memory only** — Claude's artifact sandbox disallows
   `localStorage`, so progress resets on reload. This is a sandbox
   limitation, not a bug.

2. **`pwa/app.jsx`** — the real, deployable build. No build step: loads
   React/ReactDOM/Babel from a CDN via `<script>` tags in `index.html`,
   uses hand-rolled inline SVG icons (no `lucide-react` dependency, so
   it still works offline once cached), and persists state to real
   `localStorage`. This is the one that actually gets hosted and
   installed on a phone.

   Structural differences from `study-app.jsx`: no `import` statements
   (globals via CDN instead), inline icon components near the top
   instead of a lucide import, `loadState()`/`useEffect` persistence
   instead of `useState(emptyState)`, safe-area-inset padding on the
   root container, a different Settings-screen footer line ("saved
   automatically on this device" vs "kept for this session"), and a
   `ReactDOM.createRoot(...).render(...)` call at the bottom instead of
   `export default`. Every other line — content, scoring, components,
   screens, routing — is identical text between the two files.

   **When you change content or logic, decide whether it needs to land
   in one or both files.** Content/scoring/screen changes: both.
   Sandbox-only concerns (icon imports, etc.): just `study-app.jsx`.

## Data model

```
SUBJECTS = {
  biology: {
    id, name, blurb, accent, available: bool,
    modules: [
      {
        id, name, blurb,
        submodules: [
          {
            id, name, blurb,
            learn: [ { title, body, band, children: [...] } ],   // recursive tree
            questions: [ { id, band, type: "mcq"|"text", prompt, options?, answer?, answers? } ],
          },
        ],
      },
    ],
  },
  chemistry: { ... },
  physics: { ... },
  earthspace: { ... },
}
```

(Pre-v0.6.0, this was `SUBJECTS.science.areas[]`, with a `science`
subject wrapping the four of these as areas. Flattened so each is now a
top-level `SUBJECTS` entry — see "Current state" above. `HomeScreen` now
maps over `Object.values(SUBJECTS)` instead of hardcoding
`SUBJECTS.science`, so adding a genuinely new subject — Maths, English —
is just adding another top-level key.)

- `learn` nodes can nest arbitrarily via `children`, but in practice
  submodules currently use 1–2 top-level nodes with 2–4 children each,
  plus one additional band-3 top-level node (see "Difficulty bands"
  below).
- `type: "mcq"` questions use `options` (array) + `answer` (exact
  string match). `type: "text"` questions use `answers` (array of
  accepted strings) — matched via `normalizeAnswer()` (lowercase, strip
  punctuation, collapse whitespace), so minor phrasing/typo variance is
  forgiven. Always include a couple of phrasing variants in `answers`
  (e.g. `["light-year", "light year", "light-years", "light years"]`).

## Difficulty bands (Achieved / Merit / Excellence) — added in v0.4.0

Every learn node and every question carries a numeric `band` (1, 2, or
3), matching NCEA's Achieved/Merit/Excellence tiers. The `BANDS`
constant near the top of `app.jsx` holds the level → code → label
mapping (`1 → "A" → "Achieved"`, etc.). `bandOf(item)` reads
`item.band`, defaulting to `1` if absent, so nothing breaks if a future
content addition forgets to set it.

**Band is a property of content, not of saved state.** `questionStats`
is still keyed by question `id` alone (see "Question ID convention"
below) — scoring functions look up each question's `band` from the
content tree at render time, filter by it, and aggregate. This means
**no `SCHEMA_VERSION` bump and no migration code** was needed to add
this feature, consistent with how the submodule restructuring was
handled previously.

**How bands behave differs between Learn and Revise, by design:**

- **Learn mode is cumulative.** `LearnScreen` holds a `maxBand` state
  (via `BandTabs`, single-select) and steps through every node with
  `band <= maxBand` (interleaved with questions — see the v0.7.0 note
  above). Selecting "Merit" includes Achieved + Merit content;
  Excellence adds the rest. This matches how the concepts actually
  build on each other. Changing the band tab regenerates the step list
  and restarts the walkthrough from step 1.
- **Revise mode is exclusive and multi-select.** Before a Revise
  session starts, `ReviseSetupScreen` shows `BandCheckboxes` — the
  student ticks exactly which band(s) they want questions from (all
  three are checked by default). The resulting question pool is
  `questions.filter(q => selectedBands.includes(bandOf(q)))`. A band
  with zero questions in the current pool is shown disabled with "No
  questions yet" rather than being hidden.

**Screen flow changed slightly** to fit the Revise checkbox step —
see "Screen flow" below.

**Tagging approach used for existing content (v0.4.0 pass):**
- All 33 submodules' existing learn nodes: top-level nodes tagged band
  1, their children tagged band 2 (children were already the more
  detailed/applied material, so this was a natural fit without
  rewriting).
- All 112 pre-existing questions: tagged band 2 if the prompt contains
  the word "why" (an "explain the reasoning" question), band 1
  otherwise. This is a heuristic, not a hand-reviewed classification —
  **worth a manual pass eventually** to catch questions that are
  Merit-level in substance without literally containing "why", and to
  promote some existing band-1 questions to band 2 where they fit.
- **33 new Excellence-tier (band 3) items were hand-written**, one
  question + one learn node per submodule, so every submodule has real
  content at all three bands rather than an empty Excellence tab. These
  are apply/evaluate/justify-style, not just recall — e.g. predicting
  bond type from an unfamiliar pair of elements, or explaining why a
  rocket accelerates in a vacuum. New question IDs continue each
  module's numbering (e.g. `cells_q15`–`cells_q18`,
  `forces_q15`–`forces_q19`) — see ID convention rules below, unchanged.

**Known gap:** band coverage is uneven — every submodule has *some*
Achieved, Merit, and Excellence content, but Merit is thin (often just
the pre-existing learn-node children plus a handful of "why" questions)
and Excellence is exactly one question/node deep per submodule. A
proper content pass adding more Merit and Excellence questions per
submodule (aiming for 3-4 per band, similar to the original band-1
density) is the natural next step, area by area.

**Design choices made without further confirmation, worth reviewing:**
- The "mastered" checkmark badge on the submodule checklist
  (`SubmoduleListScreen`) reflects **Achieved-band mastery specifically**
  (`submoduleBandScore(sm, 1, progress) >= MASTERY_THRESHOLD`), not an
  average across all bands — since Achieved is the NCEA pass threshold.
  Merit/Excellence scores are shown alongside as three small per-band
  rings per row, but don't affect the checkmark.
- The overall (non-band) `submoduleScore()` / `moduleScore()` /
  `subjectScore()` functions were kept, now defined as the average of
  whichever bands have content (via a shared `avg()` helper) — used for
  the coarse rings on Home/Module screens where a single number is more
  useful than three. (Pre-v0.6.0 there was also an `areaScore()` in
  between `moduleScore()` and `subjectScore()`; it's gone now that
  subject and area are the same thing — see "Current state".)

## Question ID convention — READ BEFORE EDITING CONTENT

Question IDs follow `{moduleId}_q{n}`, e.g. `cells_q1`...`cells_q18`
(the last four of which are the new band-3 questions added in v0.4.0).
**Progress is stored keyed by these IDs, not by submodule structure or
band.**

```
state.progress[subjectId][moduleId].questionStats["cells_q1"]
  = { seen, correct, ema }
```

(Pre-v0.6.0 this was `state.progress[subjectId][areaId][moduleId]`,
with `subjectId` always `"science"` — see "Current state" above for the
flatten and the progress migration this required.)

**Rules for future content edits (unchanged, still apply):**
- Adding new questions: always use the next free `_qN` number. Never
  reuse or renumber existing IDs.
- Removing a question: just stop referencing its ID in the content
  tree. The orphaned stat sits harmlessly unused.
- Renaming a `subject`/`module` `id` (not `name`) breaks existing saved
  progress for that branch. Change `name`, not `id`. (There's no
  separate `area` level any more as of v0.6.0 — each former area's `id`
  is now the subject's own `id`, so the same rule just applies one
  level up the path than it used to.)
- Submodule `id`s are not part of the progress key path, so they're
  safe to rename/reorganise freely.
- **Changing a question's `band` after the fact is safe** — it just
  reclassifies which band bucket that question's existing EMA shows up
  under. No state migration needed, same as everything else about
  bands.

## Scoring model

- Each question tracks an EMA (exponential moving average) of
  correctness, 0–100: `ema = ema*0.65 + (correct?100:0)*0.35`, seeded
  by the first attempt.
- **`submoduleBandScore(submodule, band, moduleProgress)`** — average
  EMA across a submodule's questions *at that band only*, including
  unattempted ones as 0 (so it reflects coverage, not just accuracy).
  Returns `null` if the submodule has no questions at that band.
- **`moduleBandScore` / `areaBandScore` / `subjectBandScore`** —
  average of the level below **at that band**, via the shared `avg()`
  helper, which filters out `null`s rather than treating them as 0 (so
  a submodule with no Excellence content yet doesn't drag down the
  Excellence average for the whole module).
- **`submoduleScore` / `moduleScore` / `areaScore` / `subjectScore`**
  (no band argument) — the overall/coarse versions, now defined as
  `avg()` across whichever of the three band scores are non-null.
  Used where a single number is more useful (Home, Area, Module list
  rings).
- `MASTERY_THRESHOLD = 80` — now checked per band where relevant (see
  "mastered" badge note above).
- `lastStudied` is still a timestamp on the module level, set whenever
  a Revise session finishes, regardless of which band(s) were tested.

## Screen flow

```
Home → Modules → Submodule checklist → Learn | Revise
                                      ↳ Learn: band tabs (cumulative),
                                        opens on whichever band was
                                        selected on the Mode screen, steps
                                        through fact→question(s)→fact...
                                      ↳ Revise: band checkboxes (exclusive,
                                        multi-select) → quiz session
                                        ↳ "Revise this whole module"
                                          (pools all submodules' questions,
                                           same band-checkbox step,
                                           submoduleId: "ALL")
```

New screen added in v0.4.0: **`revise-setup`**, which sits between the
Mode-choice screen (or the "Revise this whole module" button) and the
quiz itself. It renders `ReviseSetupScreen`, which shows
`BandCheckboxes` and a "Start (N questions)" button; the chosen bands
array is passed forward via nav state (`{ ...current, screen: "revise",
bands }`) to `ReviseScreen`, which filters its question pool before
shuffling.

Navigation is still a simple stack (`nav` array of `{screen, ...params}`,
push/pop), unchanged in shape — the new screen is just another entry
in the same if/else routing chain in the root `Orbit` component.

`ReviseScreen` still just needs an object with `.name` and
`.questions` for `module`, plus a new `bands` array prop (defaults to
`[1, 2, 3]` if somehow missing). Both a real submodule and the
synthetic "revise all" pseudo-object satisfy that shape.

## New components (v0.4.0)

- **`BandBadge({ level, accent, size })`** — small pill showing "A"/
  "M"/"E". Used on learn nodes above band 1, and on the in-quiz header
  when more than one band is being tested in the same session.
- **`BandTabs({ selected, onSelect, accent, scores })`** — single-select
  row of three tabs, each showing that band's proficiency %. Used in
  `ModeChoiceScreen` (informational, plus drives what Learn opens to)
  and `LearnScreen` (drives the cumulative content filter).
- **`BandCheckboxes({ selectedSet, onToggle, accent, counts })`** —
  multi-select checkbox list, one row per band, disabled when a band
  has zero questions in the current pool. Used only in
  `ReviseSetupScreen`.

## Content coverage (as of v0.4.0)

| Area | Modules | Submodules | Questions (band 1 / 2 / 3) |
|---|---|---|---|
| Biology | Cells & Organisation, Ecology & Ecosystems | 4 + 5 | ~26 / ~6 / 9 |
| Chemistry | Atoms/Elements/Periodic Table, Chemical Reactions | 4 + 4 | ~26 / ~2 / 8 |
| Physics | Forces & Motion, Energy & Waves | 5 + 3 | ~26 / ~2 / 8 |
| Earth & Space | Earth Systems & Climate, Solar System & Beyond | 4 + 4 | ~26 / ~2 / 8 |

(Approximate band 1/2 split per area — exact counts depend on how many
existing prompts happened to contain "why"; band 3 counts are exact,
one per submodule.)

**Stale note (post-v0.4.0):** a genetics/variation module (Biology) and a
Physical Properties module (Chemistry, AS92023) were added after this
table was written, and it was never refreshed for either — the row
counts above under-count Biology and Chemistry. The Physical Properties
module specifically (added in the v0.5.0 pass, sourced from
`content/92023_NCEA_L1_CB1.4_Physical_Properties_AI_Summary.txt`) has 6
submodules (intro, ionic, metallic/alloys, molecular, covalent network,
polymers) and 47 questions, evenly built at 3/3/2 band-1/2/3 per
submodule rather than the thin 1-question-per-band pattern described
below — a full re-audit of this table is still owed.

Content is loosely based on NCEA Level 1 Science's four knowledge
strands (Biology / Chemistry / Physics / Earth & Space Science). It is
**not** a literal transcription of NZQA achievement standards — the two
inquiry-based internal standards (1.1, 1.2) don't fit a fact-recall
quiz format, so they were deliberately left out in favour of
knowledge-strand content. Worth flagging to the student/parent that
this supplements but doesn't replace official NCEA assessment prep,
and that the Achieved/Merit/Excellence bands here are a study aid
loosely modelled on NCEA's grading language, not a certified mapping
to actual standard-specific grade boundaries.

## Design system

- Petrol/navy dark theme (`--bg: #12181F`), amber accent (`--accent:
  #F2B705`), soft per-area accent colours (biology green, chemistry
  blue, physics violet, earth orange) — all defined as CSS custom
  properties on the root container in `Orbit`'s return statement. Band
  UI reuses these same per-area accent colours (no separate band colour
  scale) — bands are differentiated by label/badge, not hue.
- Fraunces (serif, headings) + IBM Plex Sans (UI) + IBM Plex Mono
  (numbers/scores), loaded via Google Fonts — injected via JS in the
  sandbox build, via `<link>` in `index.html` for the PWA build.
- No Tailwind — plain inline styles + a shared `styles` object at the
  bottom of the file, plus one `<style>` tag for global resets.

## PWA specifics (`pwa/` folder only)

- No bundler. `index.html` loads React/ReactDOM/Babel-standalone from
  `unpkg.com`, then `app.jsx` via `<script type="text/babel">`.
- `manifest.json`: name "Orbit — Level 1 Science", short_name "Orbit".
- Icons are hand-drawn (Pillow, not an SVG→PNG conversion — ImageMagick
  in the build environment lacked the `rsvg-convert` delegate) — an
  atom mark (three orbits + nucleus) in the app's amber-on-petrol
  palette. Sizes: 192, 512, 512 maskable, 180 (apple-touch-icon), 32
  (favicon). **Not regenerated in the v0.4.0 pass** — reuse the
  existing icon files when merging this update in.
- `sw.js`: cache-first for same-origin app-shell files, network-first
  falling back to cache for CDN assets (React/fonts). Cache name is
  `orbit-shell-v{APP_VERSION}` — **bump both `APP_VERSION` in
  `app.jsx` and the matching one in `sw.js` together** when shipping a
  content/logic update, or the service worker won't invalidate its
  cache and users won't see the update. Both are now `0.4.0`.
- Deployment: any static host with HTTPS (GitHub Pages, Netlify,
  Cloudflare Pages). See `README.md` for install steps. Not deployed
  anywhere yet as of this writing — all testing so far has been via the
  Claude sandbox artifact preview only.

## Known gaps / likely next steps

- **Band content depth** — see "Known gap" under Difficulty bands
  above. Merit is thin, Excellence is exactly one item deep per
  submodule. Next content pass should even this out.
- **Existing-question band tagging was heuristic** ("why" in the
  prompt → Merit), not hand-reviewed. Worth a manual pass per area.
- **Not yet deployed anywhere real.** `localStorage` persistence and
  offline caching are implemented but untested outside the local file
  structure — worth a real device test once hosted.
- No automated check that content edits preserve question IDs (manual
  rule only — see "Question ID convention" above).
- ~~No way to add a second subject yet through the UI...~~ **Fixed in
  v0.6.0** — `HomeScreen` now maps over `Object.values(SUBJECTS)`
  instead of hardcoding `SUBJECTS.science`, as part of the area-flatten
  described under "Current state". Adding a real additional subject
  (Maths, English, ...) is now just adding another top-level `SUBJECTS`
  key with `available: true`.
- No settings for adjusting `MASTERY_THRESHOLD`, the EMA decay
  weighting, or which band drives the "mastered" badge — all hardcoded
  constants/decisions, deliberately not user-configurable for now.
