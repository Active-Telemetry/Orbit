# Orbit — Context & Handoff Notes

A study app for NCEA Level 1 (NZ) subjects, built for a specific student.
Currently: Science only. Designed so more subjects can be added later
without restructuring.

This file exists so a new chat can pick up work without re-deriving the
decisions below. Read this before touching `app.jsx`.

## Current state

- **Version:** 0.3.0 (in `APP_VERSION` in `app.jsx`, and matching
  `CACHE_NAME` in `sw.js`)
- **Live now:** Science, all four areas (Biology, Chemistry, Physics,
  Earth & Space), 8 modules, 33 submodules, 112 questions total
- **Two parallel copies of the app exist** — see "Two builds" below.
  They should be kept in sync by hand; there's no shared source yet.

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
   root container, root component named differently only if you check
   — both are named `Orbit`.

   **When you change content or logic, decide whether it needs to land
   in one or both files.** Content/scoring/screen changes: both.
   Sandbox-only concerns (icon imports, etc.): just `study-app.jsx`.

## Data model

```
SUBJECTS = {
  science: {
    id, name, tagline,
    areas: [
      {
        id, name, blurb, accent, available: bool,
        modules: [
          {
            id, name, blurb,
            submodules: [
              {
                id, name, blurb,
                learn: [ { title, body, children: [...] } ],   // recursive tree
                questions: [ { id, type: "mcq"|"text", prompt, options?, answer?, answers? } ],
              },
            ],
          },
        ],
      },
    ],
  },
}
```

- `learn` nodes can nest arbitrarily via `children`, but in practice
  submodules currently use 1–2 top-level nodes with 2–4 children each.
- `type: "mcq"` questions use `options` (array) + `answer` (exact
  string match). `type: "text"` questions use `answers` (array of
  accepted strings) — matched via `normalizeAnswer()` (lowercase, strip
  punctuation, collapse whitespace), so minor phrasing/typo variance is
  forgiven. Always include a couple of phrasing variants in `answers`
  (e.g. `["light-year", "light year", "light-years", "light years"]`).

## Question ID convention — READ BEFORE EDITING CONTENT

Question IDs follow `{moduleId}_q{n}`, e.g. `cells_q1`...`cells_q14`.
**Progress is stored keyed by these IDs, not by submodule structure.**

```
state.progress[subjectId][areaId][moduleId].questionStats["cells_q1"]
  = { seen, correct, ema }
```

This is *why* the big submodule restructuring (splitting each module's
flat question list into submodule-scoped groups) didn't need any state
migration — the IDs never changed, only which array they're grouped
under. Submodule/module/area/subject scores are all computed live from
this flat stats object by looking up whichever question IDs the current
content defines.

**Rules for future content edits:**
- Adding new questions: always use the next free `_qN` number. Never
  reuse or renumber existing IDs.
- Removing a question: just stop referencing its ID in the content
  tree. The orphaned stat sits harmlessly unused — don't try to delete
  it from anyone's saved state.
- Renaming a `subject`/`area`/`module` `id` (not `name` — the `id`)
  breaks existing saved progress for that whole branch, because the
  state tree is nested under those IDs. If a module ever needs to be
  renamed for display purposes, change `name`, not `id`.
- Submodule `id`s are *not* part of the progress key path (only
  `moduleId` is), so they're safe to rename/reorganise freely — that's
  what made the last restructuring low-risk.

## Scoring model

- Each question tracks an EMA (exponential moving average) of
  correctness, 0–100: `ema = ema*0.65 + (correct?100:0)*0.35`, seeded
  by the first attempt. Recent answers matter more than old ones.
- `submoduleScore()` = average EMA across a submodule's questions,
  **including unattempted ones as 0**. This makes the score reflect
  *coverage* as well as *accuracy* — a submodule you've only half
  attempted can't show 100%.
- `moduleScore()` = average of its submodules' scores (not a flat
  average of all questions — submodules are weighted equally
  regardless of how many questions they contain).
- `areaScore()` / `subjectScore()` = average of the level below,
  filtered to `available: true` areas only.
- `MASTERY_THRESHOLD = 80` — submodules at or above this show a
  checkmark on the checklist screen instead of a number badge.
- `lastStudied` is a timestamp on the module (not submodule) level,
  set whenever a revise session finishes.

## Screen flow

```
Home → Areas → Modules → Submodule checklist → Learn | Revise
                                              ↳ "Revise this whole module"
                                                (pools all submodules' questions
                                                 into one session, submoduleId: "ALL")
```

Navigation is a simple stack (`nav` array of `{screen, ...params}`,
push/pop) rather than a router — fine for this depth, would need
rethinking if subjects/areas nest deeper later.

`ReviseScreen` is generic: it just needs an object with `.name` and
`.questions`. Both a real submodule and the synthetic "revise all"
pseudo-object (`{ id: "all", name: module.name, questions: [...flattened] }`)
satisfy that shape — no special-casing inside the component.

## Content coverage (as of v0.3.0)

| Area | Modules | Submodules | Questions |
|---|---|---|---|
| Biology | Cells & Organisation, Ecology & Ecosystems | 4 + 5 | 28 |
| Chemistry | Atoms/Elements/Periodic Table, Chemical Reactions | 4 + 4 | 28 |
| Physics | Forces & Motion, Energy & Waves | 5 + 3 | 28 |
| Earth & Space | Earth Systems & Climate, Solar System & Beyond | 4 + 4 | 28 |

Content is loosely based on NCEA Level 1 Science's four knowledge
strands (Biology / Chemistry / Physics / Earth & Space Science). It is
**not** a literal transcription of NZQA achievement standards — the two
inquiry-based internal standards (1.1, 1.2) don't fit a fact-recall
quiz format, so they were deliberately left out in favour of
knowledge-strand content. Worth flagging to the student/parent that
this supplements but doesn't replace official NCEA assessment prep.

## Design system

- Petrol/navy dark theme (`--bg: #12181F`), amber accent (`--accent:
  #F2B705`), soft per-area accent colours (biology green, chemistry
  blue, physics violet, earth orange) — all defined as CSS custom
  properties on the root container in `Orbit`'s return statement.
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
  (favicon).
- `sw.js`: cache-first for same-origin app-shell files, network-first
  falling back to cache for CDN assets (React/fonts). Cache name is
  `orbit-shell-v{APP_VERSION}` — **bump both `APP_VERSION` in
  `app.jsx` and the matching one in `sw.js` together** when shipping a
  content/logic update, or the service worker won't invalidate its
  cache and users won't see the update.
- Deployment: any static host with HTTPS (GitHub Pages, Netlify,
  Cloudflare Pages). See `README.md` for install steps. Not deployed
  anywhere yet as of this writing — all testing so far has been via the
  Claude sandbox artifact preview only.

## Known gaps / likely next steps

- **Not yet deployed anywhere real.** Everything above about
  `localStorage` persistence and offline caching is implemented but
  untested outside the local file structure — worth a real device test
  once hosted.
- No automated check that content edits preserve question IDs (this
  was discussed but not built — see "Question ID convention" above for
  the manual rule in the meantime).
- Chemistry/Physics/Earth & Space content hasn't had the same depth
  pass Biology got first — all four areas are now structurally even
  (submodules + 14 Qs/module) but worth a factual accuracy re-check
  before relying on it for real study.
- No way to add a second subject yet through the UI — the data model
  supports it (`SUBJECTS` is already a dict), but `HomeScreen`
  currently hardcodes `SUBJECTS.science` rather than mapping over
  `SUBJECTS`. Trivial to fix when a second subject is actually added.
- No settings for adjusting `MASTERY_THRESHOLD` or the EMA decay
  weighting — both are hardcoded constants, deliberately not
  user-configurable for now.
