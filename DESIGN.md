# DESIGN.md — Styling Source of Truth

Single source of truth for this counter app's look. Follow this file over
guesswork or generic "nice UI" instincts. Keep the whole app consistent
with the rules below — don't invent variations per screen.

## Vibe

Playful, rounded, high-contrast. Soft pastel color blocks + solid black for
interactive controls and headers. Flat, no shadows/gradients/skeuomorphism.

## Shape

- Everything rounded. Big radius on cards/buttons (`~16-20px`), full pill
  radius (`999px`) on filter chips, tags, and the primary FAB-style button.
- Circular buttons for +/- controls: black background, white icon, perfect
  circle, no border.

## Color

- Base background: very light neutral (near-white, slightly cool grey).
- Cards/counters: solid pastel fill, one flat color per card (e.g. orange,
  blue, purple, green, yellow). No gradients. Pick from a small fixed
  pastel palette, reuse it — don't invent a new hex per card.
- Primary actions & icon buttons (+, -, save, add): solid black background,
  white content. Black is the one "always interactive" color signal.
- Text on pastel cards: black/near-black, high contrast, no low-opacity
  grey-on-color.
- Selection state (see Buttons & Controls) reuses this same black/grey
  logic — don't introduce a separate color language for it.

## Typography

- Bold, black, sans-serif for headers and numbers (counts are the hero
  content — largest, boldest text on any screen).
- Regular weight for secondary/meta text (labels like "Total", "Unit
  Name", placeholder text) in muted grey.
- No decorative fonts. System sans-serif stack is fine.

## Buttons & Controls

- Pill-shaped for text buttons (bold label, black or accent fill, white
  text). Perfect circle for icon-only buttons (+, −, back, close).
- Active/selected state = black fill. Inactive state = light grey fill,
  dark grey text. This is the one selection pattern used everywhere
  (chips, swatches, tabs) — don't invent a second one.
- Charts/graphs, if used: minimal, no clutter (no heavy borders, no legend
  noise), drawn in the relevant pastel/accent color, thin gridlines.

## Mobile-first

- Design and build for mobile viewport first (~375-430px wide); desktop is
  not a target unless asked. Single-column layouts, no side-by-side panels.
- Touch targets ≥44px, comfortable thumb reach — bottom of screen is prime
  real estate for primary actions (e.g. main "Add" button).
- No hover-only interactions (no tooltips/menus that require a mouse
  hover) — everything must work with tap alone.
- Fixed/sticky top bar, content scrolls independently underneath.

## Spacing

- Generous padding inside cards, comfortable tap targets (buttons feel
  ≥44px). Don't cram elements — this app has few screens, let content
  breathe.

## What to avoid

- No gradients, drop shadows, glassmorphism, or skeuomorphic effects.
- No more than one accent/interactive color language (black = interactive,
  pastel = content/category color). Don't add a third competing color role.
- No dense data tables — this app communicates through cards, chips, and
  simple charts, not grids of text.

## Implementation notes

- Plain CSS (or CSS Modules) is enough — no design system/token library
  (see `AGENTS.md`). Hardcode the pastel palette and black/white/grey
  values as CSS variables in one place (e.g. `:root` or a single
  `theme.css`) so they're reused, not redefined per component.
- Reference screenshots: ask the user if unsure how a new screen/component
  should look — don't extrapolate far beyond what's shown here.
