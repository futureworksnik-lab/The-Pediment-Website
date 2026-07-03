# Design Foundation — The Pediment

> **The Leadership Prologue 2026** · v1.0 · Design system source of truth. Pairs with `01`–`03`.
> Direction: **"Quiet Authority"** — prestige through restraint + institutional gravitas. Synthesised from the design brief + NotebookLM (Vignelli-schooled) critique. Concrete values are proposals to refine in hi-fi, not arbitrary taste.

---

## 1. Direction & principles

**Quiet Authority.** Prestige is earned through discipline, not decoration. No architecture literalism (the type must not "bark"), no heritage-luxury cliché. Warmth carries the human, in-person nature of the gathering; restraint carries the exclusivity.

**Principles (the decision filter):**
1. **Discipline over decoration** — every element carries a precise purpose or it is cut.
2. **Space is structural silence** — negative space signals confidence; crowding signals anxiety.
3. **Type is the architecture** — meaning felt through weight, proportion, and rhythm; never literal.
4. **One signal, used sparingly** — a single accent earns its voltage through restraint.
5. **Craft is the credential** — optical spacing and micro-quality *are* the trust argument.

## 2. Color

Warm ivory is the dominant house; **dark is deployed as punctuation** at 2–3 dramatic moments (hero and/or apply). Accessibility solved at the token level: semantic pairs guarantee WCAG AA by default. No pure black, no pure white.

| Token | Role | Proposed value |
|---|---|---|
| `surface-primary` | Dominant page base | `#F5F1EA` warm ivory |
| `surface-raised` | Cards / raised fields | `#FBF8F2` |
| `surface-threshold` | Dark punctuation sections | `#16130F` warm near-black |
| `text-authoritative` | Primary ink (on light) | `#1C1917` warm near-black |
| `text-secondary` | Supporting text | `#57534E` warm stone |
| `text-on-threshold` | Text on dark sections | `#F1ECE3` |
| `accent-signal` | The one accent, sparing | `#5E2029` deep oxblood/bordeaux |
| `accent-on-threshold` | Accent used on dark | small marks/hairlines only; text stays ivory |
| `border-hairline` | Dividers, field baselines | `#1C1917` @ 12–16% |

**Rules:** accent appears only on the mark, primary CTA, and the occasional rule/quote — never as fills or "swashes." Verify oxblood-on-ivory and ivory-on-threshold contrast at build (both target AA for text). On dark sections, do not set body text in bordeaux; keep it ivory and reserve accent for hairlines/detail.

## 3. Typography — Rule of Two

Two families only; weights and italics carry function.

- **Display serif:** contemporary high-contrast serif (not literal Bodoni — hairlines break at small sizes). Build pick: **Fraunces** (free, variable). Licensed upgrade: **Canela**.
- **Text / UI:** humanist-warm grotesque. Build pick: **Hanken Grotesk** (free). Alt: Geist.
- **Contrast is forceful** — big display against calm body; no timid hierarchy.

**Scale (fluid `rem`, ~1.25 base with an aggressive display jump):**

| Token | Use | Size (clamp target) | Family / weight |
|---|---|---|---|
| `display-xl` | Hero title | `clamp(2.75rem, 6vw, 5rem)` | Serif, light/regular |
| `h1` | Section titles | `clamp(2rem, 4vw, 3.25rem)` | Serif, regular |
| `h2` | Sub-sections | `clamp(1.5rem, 2.5vw, 2.25rem)` | Serif, regular |
| `h3` | Card / label heads | `1.375rem` | Grotesque, medium |
| `body-lg` | Lead paragraphs | `1.1875rem` | Grotesque, regular |
| `body` | Default | `1rem` | Grotesque, regular |
| `caption` | Meta, legal | `0.8125rem` | Grotesque, regular |

Line-height: display ~1.05–1.1; body ~1.6. Optical, not mechanical letter-spacing — trust the eye; tighten large display slightly, leave body alone.

## 4. Spacing & grid

- **8px spacing scale:** `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. No off-scale values.
- **Grid:** 12-col desktop; max content width ~1200–1280px; 24px gutters; generous outer margins. Single column on mobile (20–24px margins), still airy.
- **Asymmetry via selection:** occupy specific columns and leave others intentionally bare. Asymmetry is grid-derived, never freeform (this also keeps the React build clean).
- **Grid-break only on semantic demand** — a pull quote, a hero, a single explosive image. Never for novelty.

## 5. Components

**Radical granularity** — build the minimum primitives, differentiate with semantic variant props (not new components). Build on accessible primitives (Radix-style) so a11y + reduced-motion are default.

Core set: `Button` (primary/quiet), `Field` (text/select/checkbox), `SectionHeader`, `Card`, `Accordion` (FAQ), `Nav`, `Footer`. Standardised layout surfaces (a `FocusView` for the application, a `ContentSection` for the scroll) enforce continuity across future events.

**The application form is the crown jewel:** single honest column, generous field spacing, fields defined by a crisp baseline stroke (not heavy glowing boxes), editorial labels.

## 6. Interaction & motion

- **Duration:** 150–300ms. Felt, not seen.
- **Easing:** asymmetric ease-out (`cubic-bezier(0.2, 0.8, 0.2, 1)`) — decisive start, gentle settle.
- **State changes are quiet:** deepen contrast or shift ~5% opacity; no ripples, pulses, or bounce.
- **Validation:** on blur or submit only — never mid-typing. Errors are a muted tonal shift + factual note in the grotesque, never a red alert.
- **Success:** quiet dissolve into a set typographic statement — no confetti.
- **Reduced motion:** `prefers-reduced-motion` fully honored via instant state changes; the site must work perfectly with motion off.

## 7. Iconography & imagery

- **Icons:** near-zero. If needed, thin geometric line, single weight, no filled/duotone mixing.
- **Imagery:** matte, material honesty. Pre-event → architectural abstraction, texture, light (never stock "networking"). Post-event → studio-grade portraits, grain over filter, identity preserved. One consistent grade/crop logic so it reads as one hand.

## 8. Accessibility (as craft)

WCAG 2.1 AA floor, solved at token level. Visible, on-brand focus states; 44px touch targets; keyboard-navigable form + FAQ; semantic HTML so a screen reader perceives the same hierarchy as the eye; reduced-motion parity.

## 9. UX philosophy & content sequence

**One intentional corridor** to the application; no dead ends, no competing CTAs.

**Sequence:** Premise (hero + brand) → Substance (vision + five themes, progressive disclosure) → Proof (experience + speakers) → Reality (tiers + price) → Respect (FAQ) → Invitation (apply).

- **Pricing** sits after substance, before the ask — tabular clarity, typographic restraint, presented as fact (no strikethrough/"discount" framing; "rate rises once it closes" stated plainly).
- **CTAs — exactly two:** a quiet, persistent header link + the terminal invitation. No "Apply Now" peppering, no sticky chasers.
- High-intent users scan headers first — the header-only path must still tell the whole story.

## 10. Logo system

- **Mark:** Wordmark + a unique **"P" monogram** (the mobile/favicon atom). Encode *threshold / pinnacle* through geometry and negative space — no columns, temples, or triangles.
- **Pragmatics:** monochrome-legible (all-black / all-white); legible ≥ 35px; clear space ≥ 0.5× mark height; drawn in two optical weights so it reads the same on light and dark grounds (ink-spread/pixel-glow test).
- **Umbrella lockup:** `THE PEDIMENT` is the constant seal of quality; sub-brands set as a secondary, lighter descriptor — `THE PEDIMENT · The Leadership Prologue`.

## 11. Reconciliation notes (for the record)

- **Adopted from NotebookLM:** semantic token naming, token-level AA, grid-first asymmetry, radical component granularity, optical spacing, CTA dignity, form pragmatics, content sequence, relational-DB documentation, concierge governance.
- **Rejected, with reason:** full dark "institutional" canvas (cargo-cults Linear/Stripe SaaS; reads cold for a human gathering) → dark used as *punctuation* instead. SaaS accent hues (International Orange / Electric Indigo) → deep oxblood chosen. Literal Bodoni (fails its own 35px pragmatics) → contemporary high-contrast serif.
- **Conceded:** bordeaux/ivory *can* read cliché if undisciplined — mitigated by restraint rules in §2 and the discipline principles.

## 12. Locked decisions
1. Base register: **warm ivory base + dark punctuation.**
2. Accent: **deep oxblood / bordeaux**, used sparingly.
3. Type: **contemporary high-contrast serif (Fraunces/Canela) + humanist-warm grotesque (Hanken Grotesk).**

## 13. Next
High-fidelity screens in Claude Design, section by section, starting with the hero and the application FocusView — the two moments that carry the most brand and conversion weight.
