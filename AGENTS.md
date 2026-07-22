# AGENTS.md — Conventions for AI Agents Working on This Repo

This is a small, single-purpose app: users create counters and view charts
of counter values over time. That's the whole scope. The app is **fully
mobile-first** — design and implement for phone viewports unless the user
explicitly asks for desktop. Keep every decision proportional to that —
this file stays short on purpose, and should only grow when the app
actually grows.

You are this project's first maintainer, not an order-taker: if a request
conflicts with something below, flag it and ask, don't silently override
this file or silently override the request.

## Design & styling

- **`DESIGN.md` is the single source of truth** for look, feel, colors,
  typography, spacing, controls, charts, and **mobile-first layout and
  interaction**. Read it before building or changing any UI (including the
  Mobile-first section).
- Don't treat desktop as a default: no wide multi-column layouts, hover-only
  controls, or responsive "scale up from mobile" work unless the user asks.
- Follow `DESIGN.md` over generic "nice UI" defaults. Keep new screens
  consistent with it — don't invent per-component variations.
- **Override order:** an explicit styling instruction from the user in the
  current request wins over `DESIGN.md`. Everything else in this repo
  (including `AGENTS.md`) does not override `DESIGN.md` for visual design.
- If a user request conflicts with `DESIGN.md` and they did not explicitly
  say to break from the design doc, flag the conflict and ask — don't
  silently drift from the design system.

## Stack

- **Vite** + **React**, plain **JavaScript** unless a specific piece of code
  benefits from types (e.g. a shared data shape used in multiple places, a
  tricky function signature). Don't set up `tsconfig`/build-wide TypeScript
  just for its own sake — add types locally (JSDoc or a `.ts` file) only
  where they actually prevent a real bug or clarify a real ambiguity. If the
  whole app ends up needing types everywhere, that's a signal to switch the
  whole project to TypeScript deliberately, not to creep into it file by file.
- Charts: pick one small library (e.g. `recharts` or `chart.js`) and stick
  with it — don't mix charting libraries.
- Styling: plain CSS or CSS Modules (see `DESIGN.md` for palette, radii,
  and component patterns). No UI kit / design-system library. Shared visual
  values live in one place (e.g. `:root` or `theme.css`) as CSS variables
  per `DESIGN.md` — not a separate token/theming framework.
- State: local component state / React context is enough. Don't add a state
  management library unless prop-drilling actually becomes painful.
- Data: if persistence is needed, start with `localStorage` unless told
  otherwise. Don't build a backend/API layer speculatively.
- Package manager: whatever the repo already uses (check `package.json`/lockfile
  before assuming).

## Code style

- Named exports/imports only (`export const Foo = ...`), no `export default`.
- One component per file, `PascalCase.jsx` (or `.tsx` if that file uses
  types), colocated CSS file if it has meaningful styles.
- Hooks: `useX.js`, one hook per file, only extract a hook once logic is
  reused or a component file is getting hard to read — don't pre-extract.
- Keep files small enough to read in one pass, but don't split files just to
  hit a line-count target. Split when a file is doing two unrelated things.
- No comments that narrate obvious code. Comment only non-obvious intent or
  a real gotcha.
- Function components + hooks, no class components.

## Structure

Flat and predictable. No layered architecture (no core/ui-kit/vertical
split — this app has one "vertical" and always will unless someone
explicitly decides to reuse it elsewhere):

```
src/
  components/    # one folder per component, e.g. components/CounterCard/
  hooks/         # shared hooks, if/when needed
  data/          # storage helpers (e.g. localStorage read/write), if needed
  App.jsx
  main.jsx
```

Don't create `core/`, `ui-kit/`, `config-schema/`, or `apps/<name>/`
folders for this project. If a second, genuinely different app needs to
reuse this code later, that's the moment to introduce a split — not before.

## What NOT to do (things intentionally skipped)

These are deliberate omissions for this project's scale, not oversights.
Don't reintroduce them without being asked:

- No graphify / code knowledge graph. Grep and reading files is fast enough
  at this size and will stay that way for a long time.
- No design system library (no Wanda, no other UI kit). Visual rules live
  in `DESIGN.md`; build plain HTML/CSS or use a lightweight, unstyled
  component if truly needed.
- No mandatory test files. Don't write tests unless the user explicitly
  asks for them in that request.
- No automated self-testing loop (don't run test suites, don't write and
  run new tests) unless explicitly requested. It's fine to run a quick
  typecheck/build if something seems broken, but don't treat that as a
  required step after every change.
- No periodic "code health review" process, no decisions log, no per-change
  review skill/subagent. This app is small enough that drift isn't a real
  risk yet.
- No multi-package/monorepo prep, no "vertical" abstraction, no speculative
  config-schema contracts for future reuse.
- No PWA, no offline handling, no analytics, no auth, no deployment
  infra — add these only when actually requested, each as its own small,
  scoped change.

## When complexity actually shows up

If the app grows real complexity later (multiple data sources, a second
distinct app reusing this code, a real backend, a real design system
requirement), that's the point to revisit this file and add structure —
propose the change explicitly rather than accreting it piecemeal.
