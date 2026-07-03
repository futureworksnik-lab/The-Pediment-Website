# The Pediment — Website Handoff

**Read this first — what this actually is (honest answer):**

This is **NOT** a Next.js / React / Vite source project. There is no `package.json`, no
`npm install`, no build step, no dev server. Running `npm run dev` will do nothing.

It is a **single-page site authored as one self-contained HTML "Design Component" (`.dc.html`)**:
plain HTML markup + a `<style>` block of hand-written CSS + one vanilla-JavaScript logic
class. It is rendered at runtime by a small custom runtime file (`support.js`) that expects
`React` and `ReactDOM` to be present as globals. There is **no external framework, no CSS
preprocessor, no bundler config, and no animation library** anywhere in it.

Two artifacts in this package, pick based on what you need:

| File | What it is | Use it for |
|---|---|---|
| `index.html` | **Fully self-contained, offline-runnable** bundle. React + runtime + all CSS + all images/fonts references inlined into one ~20 MB file. **Double-click it → it runs in any browser, no server, no install.** | The exact, approved visual + motion reference. Static hosting. Quick "does it look right" checks. |
| `The Pediment - Website.dc.html` + `support.js` + `assets/` | The **authored source** — the file we actually edit. Human-readable markup, CSS, and logic. Needs `support.js` and `assets/` beside it, and React/ReactDOM (see below). | Reading/lifting the real markup, CSS tokens, copy, and animation code when rebuilding in your stack. |

Both represent the identical, current, approved design. `index.html` was re-bundled from the
source at handoff time — it is **not** stale.

---

## How to run / view

**Option A — just look at it (recommended):**
Open `index.html` in any modern browser. Done. Everything works offline including animations,
the FAQ accordion, and the form's client-side validation.

**Option B — run the authored source directly:**
The `.dc.html` needs three things loaded before it renders: `React`, `ReactDOM`, and
`support.js`. In the Claude Design environment these are injected automatically. To run the raw
`.dc.html` yourself you would have to add React/ReactDOM script tags and serve the folder over
HTTP. **For a production rebuild you almost certainly do not want to do this** — treat `index.html`
as the visual spec and port the markup into your own stack instead (see "Recommended path for
Emergent" below).

---

## Stack / dependencies (be explicit)

- **Framework:** none. Custom "Design Component" runtime (`support.js`, ~1,650 lines, generated —
  do not hand-edit). It parses the `<x-dc>` template, runs the `class Component extends DCLogic`
  logic, and renders via React.createElement.
- **React / ReactDOM:** required as globals by `support.js`. Bundled inside `index.html`.
- **CSS:** hand-written, all inside one `<style>` block in the `.dc.html` head (`<helmet>`). No
  Tailwind, no Sass, no CSS modules.
- **Fonts:** loaded from **Google Fonts CDN** (not local files). Exact request in use:
  - **Fraunces** — variable, optical size `9..144`, weight `300..700`, roman + italic
    (`ital,opsz,wght@0,9..144,300..700;1,9..144,300..700`). Used for all display/serif type.
  - **Hanken Grotesk** — variable, weight `300..700`, roman + italic
    (`ital,wght@0,300..700;1,300..700`). Used for all body/sans type.
  - `display=swap`. If you self-host, pull both as variable fonts at those weights/styles.
- **Animation libraries:** **NONE.** No Framer Motion, no GSAP, no Lottie. Everything is native
  CSS transitions/`@keyframes` + `IntersectionObserver` + a little `requestAnimationFrame`-free
  scroll math. Nothing to add to a dependency list — but that also means when you rebuild in
  React, you re-implement these by hand (they're simple; details below).

---

## Folder structure

```
handoff/
├─ index.html                       ← self-contained runnable bundle (the visual spec)
├─ The Pediment - Website.dc.html   ← authored source (markup + CSS + logic)
├─ support.js                       ← custom runtime (generated; needs React/ReactDOM globals)
├─ assets/                          ← all imagery / textures (7 PNGs)
│   ├─ threshold-door.png           (cover + apply backgrounds)
│   ├─ plaster-pale.png             (Premise bg)
│   ├─ hall-ivory.png               (Gathering bg)
│   ├─ oxblood-beam.png             (Prologue + Speakers bg)
│   ├─ columns-dark.png             (Convergence/Pillars bg)
│   ├─ travertine-curve.png         (Experience/Folio VI bg + the Folio VI detail crop)
│   └─ travertine-close.png         (Tiers/Admission bg)
└─ README.md                        ← this file
```

**Where things live inside `The Pediment - Website.dc.html`:**
- **Design tokens** — top of the `<style>` block, in `:root` (see below). Colors, and the font
  stacks. Spacing is applied inline per element on an ~8px rhythm (there is no separate spacing
  token file).
- **All CSS** — one `<style>` block immediately after `:root`. Utility-ish classes named per
  section (`.folio`, `.eb`, `.foot`, `.qa`, `.evitem`, etc.).
- **Section markup** — each screen is a `<section class="folio …" data-screen-label="…">` in body
  order: Cover → Premise → Gathering → Prologue → Convergence → Experience(VI) → Admission/Tiers →
  Speakers → FAQ(IX) → Apply → Footer.
- **Logic / animation JS** — one `class Component extends DCLogic { … }` near the bottom, inside
  the `<script data-dc-script>` tag.

**Design tokens (`:root`), copy verbatim into your stack:**
```
--ink:#17130E  --ink2:#120F0B  --inkT:#1C1917
--paper:#F3EEE3 --paperR:#FAF6EC
--ox:#5E2029 (oxblood)  --oxRed:#8A3541
--gold:#C9A76B  --goldB:#E9D3A6
--stone:#57503F  --ivory:#F1EBDF  --ivMut:rgba(241,235,223,.72)
```

---

## Animation implementation (specific, per your questions)

**1. The home-page "Act 1 → Act 2 → Act 3 threshold-crossing / page-turn sequence."**
⚠️ **This does not exist as a page-turn / act sequence.** There is no discrete Act1/2/3 transition
and no page-turn animation anywhere in the code. What is actually on the home page is a **single
continuous vertical scroll** through the stacked `<section>` folios, with three motion behaviors:
  - **Scroll-reveal:** every element with class `.rv` starts faded/translated down and settles into
    place when it scrolls into view. Built with **one `IntersectionObserver`** (`setupObs()`),
    which adds an `.on` class; the movement itself is a native CSS transition on `.rv`. Staggered
    by a per-element `transition-delay` set in JS.
  - **The diagonal "thread" line** running down the whole page (`.threadwrap` SVG): a single path
    whose control points are computed in JS from each section's position (`buildThread()`), and
    which **draws progressively as you scroll** by animating `stroke-dashoffset` against scroll
    progress (`updThread()`). Disabled below 1080px viewport width.
  - **Header theme flip:** the fixed header swaps dark/light as it passes over dark vs. light
    sections (scroll handler in `setupObs()`).
  If a literal page-turn/act sequence was expected in the approved design, it is **not present in
  this code** — flag raised here so it's known before handoff, not after.

**2. Folio VI curved-line narrative spine (draws progressively as commitments enter view).**
Real and present. Vanilla JS + native CSS, no library:
  - `setupEvLine()` / `buildEvLine()` measure the on-screen position of five waypoint dots
    (`.evdot`) with `getBoundingClientRect()` and generate a 5-segment SVG bezier path connecting
    them (`.evseg` paths inside `.evline`).
  - A dedicated `IntersectionObserver` fires per commitment; on entry it calls `drawEvSeg(n)` which
    sets that segment's `stroke-dashoffset` to 0 → the segment "draws" via a native CSS transition
    (`.evseg { transition: stroke-dashoffset .28s ease-out }`), and the commitment block fades/settles
    in (`.evrv` → `.on`).
  - Subtle background parallax on the texture layer only (`evParallax()`), text never moves.
  - Full `prefers-reduced-motion` fallback: `.nomo` class forces line fully drawn + all content
    visible + no parallax.

**3. Folio IX FAQ accordion open/close.**
Simplest of the three: **native HTML `<details>`/`<summary>` — zero JavaScript.** Each Q&A is a
`<details class="qa">`. The oxblood marker is a CSS `::after` on `.qs` that swaps `+` → `−` via the
`[open]` state. Open/close is the browser default; the marker/label transitions are native CSS at
~300ms ease-out. Multiple questions can be open independently. `prefers-reduced-motion` honored.

---

## What is functional now vs. what Emergent still has to build

**Fully functional (client-side):**
- All layout, typography, imagery, responsive behavior (desktop + mobile), and every animation
  above.
- The Apply form's **client-side** behavior: the VIP Delegate / Premium Observer toggle, the
  conditional "Delegate status" field that only appears for VIP, the two required consent
  checkboxes, inline validation with the exact error copy, and the success/confirmation state.

**NOT wired — Emergent must build:**
- **Form submission has no backend.** On submit, `submit()` validates and then just flips local
  state to a "thank you" screen (`this.setState({ done: true })`). **Nothing is sent anywhere** —
  no network request, no database write, no email. To go live you need to:
  1. POST the collected fields to **Supabase** (fields: `full_name`, `email`, `phone`,
     `linkedin_url`, `instagram_handle`, `affiliation`, `domain_sector`, `city`, `tier`, and
     `delegate_status` for VIP, plus the two consent booleans).
  2. Trigger **transactional email** (confirmation to applicant; the approved confirmation copy is
     already in the design — VIP vs. Observer variants).
  3. Persist consent (media waiver + privacy) with timestamp — these are compliance-relevant.
- **Footer / nav legal links** (Privacy, Terms, Refunds, Cookies, LinkedIn, Instagram, X) are
  `href="#"` placeholders. No pages behind them yet.
- **No analytics, no cookie-consent gate, no waitlist page** — the content docs
  (`uploads/website/`, in the Claude project, not in this zip) spec these but they are not built.

---

## Known gaps / rough edges

- The diagonal thread line and Folio VI spine are **JS-measured from live DOM positions** — they
  rebuild on resize and after reveals settle. In a React rebuild, re-measure after layout/fonts
  load or they can be a few px off on first paint (the source already does this with retry timers).
- Fonts are **CDN-loaded**; first paint can show a brief fallback. Self-host if you need zero FOUT.
- `index.html` is ~20 MB because React + all textures are inlined. That's fine for a reference
  artifact but don't ship it as your production page — rebuild lean.

---

## Fidelity checklist (section by section, vs. latest approved state)

| Section | In this export | Notes |
|---|---|---|
| Cover / Hero (01) | ✅ matches | "emerging leaders" |
| Premise (02) | ✅ matches | "emerging leaders" |
| Gathering / About (03) | ✅ matches | |
| Prologue (04) | ✅ matches | "emerging leaders" |
| Convergence / Pillars (05) | ✅ matches | |
| **Experience / Folio VI (06)** | ✅ matches | Full re-composition: curved narrative spine, 5 varied commitment treatments, ghost "VI" watermark, travertine detail crop, disclaimer preserved |
| Tiers / Admission (07) | ✅ matches | Premium Observer card: "emerging professionals" |
| Speakers / In the Room (08) | ✅ matches | Announcement placeholder (by design) |
| **FAQ / Folio IX (09)** | ✅ matches | 20-question restructure into 3 parts (i–xx continuous), all 10 new Q&As verbatim, tightened density, restrained crossing-marks |
| Apply / Threshold (10) | ✅ matches | Toggle + conditional VIP field + consent + validation present; **submit not wired to backend** |
| Footer | ✅ matches | Legal/social links are `#` placeholders |

**"young"/"youth" → "emerging" is now applied site-wide** — verified zero remaining instances of
either word anywhere in the source. The four lines changed in this pass (all copy-only, no layout
touched):
1. **Cover (01)**, subtitle: "...for India's most vetted **young** leaders." → "...**emerging** leaders."
2. **Premise (02)**, annotation paragraph: "...India's most vetted **young** leaders — across global governance..." → "...**emerging** leaders..."
3. **Prologue (04)**, opening paragraph: "...fiercely selected group of India's **young** leaders is chosen..." → "...**emerging** leaders is chosen..."
4. **Tiers (07)**, Premium Observer card: "...operators, and **young** professionals invited to join the room." → "...**emerging** professionals..."

(Folio IX's own instance was already fixed in the prior pass.) Everything visible in `index.html`
is the current approved state, with no remaining content discrepancies known.

---

## Nothing was regenerated or reinterpreted

The source `.dc.html` is the exact approved file. `index.html` is a mechanical re-bundle of that
same source (React + runtime + assets inlined) so it runs standalone — no design, copy, layout, or
motion was changed during export.
