# Design Prompts & Critiques — The Pediment Website

> Working log of Claude Design prompts and design critiques. Pairs with `04-design-foundation.md`.
> Direction: **"Quiet Authority"** · Signature system: **"The Dossier"** (bound, numbered edition — running heads, section numerals I–VI, colophon spec-blocks, Vol. I / MMXXVI, threshold hairline).

---

## 1. Home page — full generation prompt (v2, "The Threshold")

*Opening concept locked: warm ivory title wall → cross the threshold → the Prologue hero. Bold & distinctive.*

```
Use the "taste" skill and the "ui-ux-pro-max" skill for this task. Read the ENTIRE attached folder first (00–04) — it is the single source of truth for content, copy, IA, and the design system. Then design the HIGH-FIDELITY, INTERACTIVE home page for The Pediment.

CRITICAL — WHAT NOT TO DO (the last attempt failed here)
The previous version looked like a generic AI/SaaS template. Do NOT repeat any of this:
- No dark hero as the opening. No left-aligned big-serif headline sitting in a centered container.
- No thin accent rule above an eyebrow, no solid rectangular filled CTA button as the hero's focal point.
- No "default premium landing" composition. If it looks like something an AI tool ships by default, it's wrong.
Distinctiveness must live in COMPOSITION, MATERIAL, TYPOGRAPHY, and MOTION — not just the copy.

THE CONCEPT — "The Threshold" (a pediment is a threshold; the site is the velvet rope you cross)
The home page opens as a THRESHOLD you pass through, in three choreographed acts driven by scroll:

ACT 1 — The Title Wall (warm ivory, full viewport):
Almost empty. The wordmark "THE PEDIMENT" set with authority and centered like a gallery title wall or the cover of a rare journal, on warm ivory paper (#F5F1EA) with visible fine paper grain/texture. A single restrained detail suggesting a threshold/aperture (an abstract fine line or opening — NOT a literal triangle/temple/column). One quiet issue line ("Vol. I · Bangalore · 5 August 2026"). Enormous negative space. It should feel like a printed object, not a screen.

ACT 2 — Crossing (the transition):
On scroll, the composition "opens" — the threshold detail parts / the wordmark recedes — and we cross into the event. Motion is the identity here: choreographed, physics-based, 150–300ms per element, ease-out, restrained. No parallax gimmicks, no bounce. Honor prefers-reduced-motion (works perfectly as instant states).

ACT 3 — The Prologue (the hero proper, still on warm ivory or a subtle paper shift):
Now reveal the event: "The Leadership Prologue 2026", the subtitle, "5 August 2026 · Bangalore", and the invitation. Compose this with intent — asymmetric use of the grid, type as the hero, generous space. The invitation should read as an invitation, not an e-commerce button.

SIGNATURE (carry distinctiveness through ALL of these):
- Composition & layout: unconventional, asymmetric via selective column occupation; type placed with editorial intent; leave columns deliberately bare.
- Material & texture: warm paper grain, ink-like type, subtle letterpress/printed cues — break the flat-digital feel. Matte, never glossy.
- Typography as hero: contemporary high-contrast serif (Fraunces/Canela feel) + humanist-warm grotesque (Hanken Grotesk). Forceful scale contrast. An ownable wordmark treatment for "THE PEDIMENT" + a "P" monogram for favicon/avatar (abstract threshold, no literal architecture).
- Motion & sequence: the threshold-crossing is the brand moment. Choreographed, quiet, purposeful.

PALETTE (from the design system, §2 of 04-design-foundation.md)
- Base: warm ivory #F5F1EA is the DOMINANT house (the opening is ivory — this is the deliberate pattern-interrupt vs. every dark AI hero).
- Ink: warm near-black #1C1917; secondary #57534E.
- Dark #16130F used ONLY as deep punctuation later (the Apply section), never the opening.
- Accent: deep oxblood #5E2029 — used sparingly (wordmark detail, the primary invitation, an occasional hairline). Never as fills or decoration. Keep small text in ink, not oxblood (contrast).

BUILD THE REST OF THE PAGE (after the opening), in order, using the exact copy from the content doc (03):
About ("Not a conference. A gathering.") → The Prologue vision → Five themes (+Climate note) → The Experience (incl. conditional travel grants "up to five, from surplus") → Tiers (VIP by invitation, NO price; Premium Observer "Inaugural Early Access — ₹5,000, non-refundable, rate rises once it closes") → Speakers holding state → FAQ accordion → Apply (dark threshold section; single honest column form, baseline-stroke fields, two mandatory consent checkboxes) → Footer (legal links, hello@thepediment.com, social placeholders, independence line).

NON-NEGOTIABLE RULES (honesty)
No affiliation/endorsement claims (independent framing only). Travel grants always conditional "up to five, from surplus." Confirmed speakers only, else holding state. Never show a VIP fee. Media-waiver + privacy consent mandatory on the form. Exactly TWO CTAs on the page: a quiet header link + the terminal Apply — no "Apply Now" peppering, no sticky chasers.

SYSTEM & CRAFT
Token-based design system (color/type/spacing/motion), 8px spacing scale, 12-col grid, fluid rem type. WCAG 2.1 AA (verify oxblood-on-ivory). Desktop 1440 + mobile 390 for every section. Semantic HTML.

DELIVER
Start with the OPENING SEQUENCE ONLY (Act 1 → 2 → 3), as an interactive prototype so I can feel the threshold crossing. Set up the full design system. Once I approve the opening, build the remaining sections in the same file, in order. Keep it distinctive, restrained, and unmistakably ours. When unsure, subtract.
```

**Outcome:** Act 1 (title wall) landed well — the quality bar. Act 3 reverted to a generic hero → see critique + refinement prompt below.

---

## 2. Critique — Act 3 ("The Leadership Prologue" hero)

**Core diagnosis:** Act 3 abandons the visual language Act 1 established (framed page, centered masthead, colophon marks NO. 01 / MMXXVI, Vol. I, threshold hairline) and reverts to a conventional "headline left + meta column right" web hero. That discontinuity is why it reads generic. Fix = carry Act 1's bound-edition "Dossier" system into every section. Consistency of the device, not new decoration, is the lever.

- **Visual hierarchy:** headline and right column compete. Rank them: headline primary; right block a quiet subordinate colophon; anchor the floating eyebrow with a section index + hairline ("I · THE PREMISE ———"); strengthen the invitation as the one action.
- **Layout & spacing:** the empty top is unresolved dead space — give it marginalia (running head / section numeral). The lone vertical hairline floats; either span it full content-height with aligned rows, or remove it. Rebuild the right column as a baseline-aligned colophon (DATE — / PLACE — / FORMAT —).
- **Typography:** constrain subtitle measure to ~50–60 chars (fixes awkward wraps); lift from mid-grey to warmer higher-contrast ink; increase headline size, tighten leading (~1.03) + tracking; roman + refined numeral treatment for "2026"; oldstyle/considered figures for dates.
- **Borders/containers:** populate the frame consistently (NO. 02, section numeral, running foot THE PEDIMENT · MMXXVI). No cards/boxes — depth via rules, alignment, type layering; matte only, never shadows.
- **Navigation:** undersized — increase link size (~16–17px) + wordmark presence/tracking (masthead feel); add breathing room to the center cluster; give ONLY "Request Invitation" a quiet ownable treatment (fine oxblood underline or bracketed label); add a subtle active-section indicator tied to the numeral system.
- **White space & composition:** rebalance to deliberate asymmetry — kicker+numeral top-left, headline on a strong baseline, colophon bottom-right, frame marks in all corners. Negative space must feel placed, not leftover.
- **Micro-interactions:** oxblood underline draw-in on hover (~200ms ease-out); arrow translate ~4px on the invitation; section numerals stepping on scroll; baseline grid everything; one consistent hairline weight/color.
- **Brand personality:** name and commit to the ownable system — **"The Dossier"** (bound, numbered edition). Deploy on every section. The system, not any single screen, is what makes it unmistakably The Pediment.

---

## 3. Act 3 refinement prompt

```
Use the "taste" and "ui-ux-pro-max" skills. Refine the "The Leadership Prologue" hero (Act 3) of the home page. Act 1 (the title wall) is the quality bar — Act 3 currently abandons its visual language and reverts to a generic web hero. The core fix: carry Act 1's "bound edition / dossier" system into Act 3 and every section.

Establish and apply a signature system called "The Dossier":
- The framed page must carry consistent marginalia on every section: a page numeral (NO. 02), a section Roman numeral (I–VI), and a running foot (THE PEDIMENT · MMXXVI) in the four corners — like Act 1.
- A recurring fine "threshold" hairline as the structural divider throughout.

Fix Act 3 specifically:
- Hierarchy: headline is primary; make the right-hand block a quiet, clearly subordinate COLOPHON, not a second hero. Anchor the eyebrow with a section index + hairline (e.g. "II · THE PREMISE ———") top-left so the top space has purpose (it's currently dead space).
- Right column: rebuild as a baseline-aligned spec/colophon block — label→value rows: DATE — 05 August 2026 · PLACE — Bangalore · FORMAT — By invitation. Remove the floating lone vertical hairline unless it spans the full content height and aligns to the rows.
- Typography: constrain the subtitle measure to ~50–60 characters (fix the awkward wraps), lift it from mid-grey to warmer higher-contrast ink. Increase headline size, tighten leading (~1.03) and tracking; consider roman + a refined numeral treatment for "2026". Use oldstyle/considered figures for dates.
- Navigation: increase link size (~16–17px) and wordmark presence/tracking so THE PEDIMENT reads as a masthead; add breathing room to the center cluster; give ONLY "Request Invitation" a quiet ownable treatment (fine oxblood underline or bracketed label); add a subtle active-section indicator tied to the numeral system.
- Composition: rebalance to deliberate asymmetry — kicker+numeral top-left, headline on a strong baseline, colophon bottom-right, frame marks in all corners. Negative space must feel placed, not leftover.
- Micro-interactions: oxblood underline draw-in on hover (~200ms ease-out), arrow translate ~4px on the invitation, section numerals stepping on scroll. Baseline grid everything; one consistent hairline weight/color. Matte only — depth via rules, alignment, and type layering, never shadows or filled cards.

Keep the warm ivory palette, oxblood used sparingly, honesty rules, and all copy from the attached docs. Show desktop 1440 + mobile 390. When unsure, subtract.
```

---

## 4. Brainstorm — four proposals, verdicts, and rationale

*Session: does the home page need (1) a vine/creeper motif, (2) a more ceremonial Act1→Act2 transition, (3) a stronger Act 3 headline, (4) color introduced from section 2 onward. Verdicts below; the refinement prompt in §5 implements the "keep" items only.*

1. **Vine/creeper ornament — rejected.** Botanical line work reads as heritage-hospitality/wedding-invite, not editorial-institutional. It also competes with "The Dossier" as a second ownable device. Richness should come from deepening the existing device (hairlines, marginalia, paper grain), not adding a second one.
2. **Ceremonial transition — kept, reframed.** "Pediment opening" risks literal architecture (already banned in §1). Reframed as a **page-turn / leaf-lift**: the ivory "paper" creases and lifts to reveal Act 3, consistent with the bound-edition (Vol. I / MMXXVI) metaphor already in place. Same ceremonial weight, no new visual vocabulary.
3. **Act 3 headline — real problem, content-safe fix.** "The Leadership Prologue 2026" is the locked H1 (`03-website-content-and-ia.md` line 32) and is reused verbatim in FAQ schema and `llms.txt` — it can't be replaced without a content-doc edit. It reads flat as a *headline* because it's a product name, not a thesis. Fix: demote it typographically toward the masthead/kicker register it already visually resembles, and let the existing subtitle clause **"on the eve of their journey to the world stage"** carry the emotional weight as the dominant display line. Zero copy changes — only typographic re-ranking of copy already approved.
4. **Color from section 2 onward — kept, re-mechanized.** `04-design-foundation.md` §11 already rejected a multi-color palette on the record. The fix isn't new hues — it's committing harder to the two tokens already licensed: oxblood earns more presence as sections progress (numerals, pull-quotes, dividers, tiers block), and the dark punctuation `#16130F` — already reserved for Apply — becomes the deliberate bookend. Richness through progression of two colors, not introduction of a third.

---

## 5. Refinement prompt v3 — transition, headline re-rank, color progression

```
Use the "taste" and "ui-ux-pro-max" skills. Refine the home page's opening sequence and carry three new rules through every subsequent section you build. Act 1 (title wall) and the current Act 3 (Dossier-fied "Leadership Prologue" hero) are both approved as the quality bar — do not regress either. This pass adds motion, hierarchy, and color-progression refinements only.

ADD TO "WHAT NOT TO DO"
- No botanical, floral, vine, or organic-line ornament anywhere on the page, at any opacity. If a texture idea reads as "wedding invitation" or "vineyard estate" rather than "rare journal / bound edition," it's wrong. Texture and richness come only from paper grain, hairlines, and marginalia — never organic linework.

1. ACT 1 → ACT 2 TRANSITION — reframe as a page-turn, not a gate-opening
Currently a generic scroll-crossfade. Rebuild it as a ceremonial page-turn / leaf-lift: as the user scrolls, the ivory "page" (Act 1) creases along a fine hairline and lifts/turns to reveal Act 3 beneath, as if turning the first leaf of a bound, numbered edition. This must read as "opening a rare book," not "opening a building" — no architectural gate, door, or aperture-parting motion. Keep it choreographed and physics-based, 150–300ms per element, ease-out, restrained. Honor prefers-reduced-motion with instant/crossfade fallback states.

2. ACT 3 HEADLINE — re-rank existing copy, do not alter it
The H1 text "The Leadership Prologue 2026" must remain verbatim (it is reused in structured data elsewhere) — do not change the words. But stop treating it as the emotional focal point. Demote it typographically into the masthead/kicker register it already visually echoes (smaller, tracked, sits near the section numeral/eyebrow). Promote the existing subtitle clause "on the eve of their journey to the world stage" (part of the approved subtitle sentence) to be the dominant, largest-weight display line of the section — this is the thesis, not the product name. The full subtitle sentence still appears in full below at readable body size; only this clause gets hero typographic treatment. Zero new copy — only a re-ranking of type hierarchy across copy that already exists in `03-website-content-and-ia.md`.

3. COLOR PROGRESSION — same two tokens, more confidence, no new hues
Do not introduce any new colors. Instead, make oxblood (#5E2029) earn more presence as the page progresses past Act 3: use it for section numerals, pull-quote marks, and divider ticks in later sections (Prologue vision, Experience, Tiers) — still never as a fill, still never on small/body text. Treat the dark punctuation (#16130F), already reserved for the Apply section, as the deliberate tonal bookend of the whole page — the one moment the page goes from paper to ink. The progression itself (more ivory early → oxblood earns weight mid-page → dark plunge at Apply) is the "richness," not a wider palette.

Keep everything else locked: warm ivory base, The Dossier marginalia (numerals, colophon, running foot) on every section, honesty rules (no affiliation claims, conditional travel grants, confirmed speakers only, mandatory consent checkboxes), exactly two CTAs. Show desktop 1440 + mobile 390. When unsure, subtract.
```

---

## 6. Page 2 ("NO. 02 · The Premise") — depth & character prompt

*Nick's read: Page 2 is correct now but still templatish — needs to feel alive, handled, non-generic. Diagnosis: it's flat (two zones, one plane) and sterile (no imperfection, no layering). Fix = depth via type-layering + one deliberate press-object imperfection, not new decoration.*

```
Use the "taste" and "ui-ux-pro-max" skills. Focus exclusively on Page 2 of the home page — the "NO. 02 / II · THE PREMISE" section (the "Leadership Prologue" hero that follows the title-wall-to-page-turn transition). It currently reads correct but flat — templatish, low character, low depth. This pass's job is to make it feel like a specific, handled, physical object, without adding a single new color or any decorative ornament.

DO NOT
- Add any botanical/vine/organic ornament, at any opacity.
- Add drop shadows, cards, gradients, or any digital-depth cue.
- Add new colors — only ivory, ink, oxblood, and #16130F (reserved for later) exist.
- Make it look more "designed" via more elements — depth comes from layering and craft, not decoration.

1. TRANSITION INTO PAGE 2 — page-turn, not gate-opening
On scroll from Act 1, the ivory page creases along a fine hairline and lifts/turns like the first leaf of a bound edition, revealing Page 2 beneath. Physics-based, 150–300ms per element, ease-out. Reduced-motion gets an instant crossfade fallback.

2. DEPTH — build it through layering, not shadows
- Set the page numeral ("02") oversized and pale (low-opacity ink, ~8–10%, not oxblood) as a ghost watermark sitting BEHIND the headline type, partially overlapped — a classic bound-edition device (title pages of rare books/journals often run a faint folio number behind the running text). This is the primary depth cue: two layers of type at different visual weights occupying the same space.
- Let the headline baseline slightly overlap the top rule of the colophon block by a few px, rather than sitting in a fully separate zone — depth through intentional overlap, not clean separation.
- Vary "ink" density across exactly one hue: headline at full-strength ink #1C1917, ghost numeral at ~8–10% ink, colophon labels at secondary #57534E. Three depths of the same ink, not new colors.

3. CHARACTER — press-object imperfection, not sterile precision
- Introduce ONE fine registration cue: the hairline divider sits very slightly (1–2px) off perfect optical center, as if hand-aligned on the press — subtle enough to read as "printed," not "buggy."
- Fill the empty top-left dead space with a single small marginal annotation — a short italic aside set in oxblood, styled like an editor's pencil note, not UI microcopy. This is the one place oxblood appears as running text.
- Give "II · THE PREMISE" a hand-set kerning/tracking treatment distinct from body type — it should feel typeset by a person, not auto-generated.

4. HEADLINE HIERARCHY — re-rank existing copy, don't rewrite it
Keep "The Leadership Prologue 2026" verbatim but demote it to the masthead/kicker register. Promote the existing subtitle clause "on the eve of their journey to the world stage" to the dominant, largest display line — that's the actual thesis of the section. The full subtitle sentence still appears below at body size.

5. MOTION — elements settle onto the page, they don't just appear
On scroll-reveal, each element (ghost numeral, headline, colophon rows, annotation) arrives with a slight, staggered "settle" — as if being placed/pressed onto the page — rather than a uniform fade-up. Stagger ~40–60ms per element. Still restrained, still quiet.

6. COLOR — oxblood starts earning weight here
This is the first section after Act 1 where oxblood may appear more than once: the marginal annotation (#3), the hairline detail, and "Request an Invitation." Still never as a fill, still never on body text.

Keep everything else locked: warm ivory base, The Dossier marginalia (numerals, colophon, running foot), honesty rules (no affiliation claims, conditional travel grants, confirmed speakers only, mandatory consent checkboxes on later forms), exactly two CTAs sitewide. Show desktop 1440 + mobile 390. When unsure, subtract — add craft, not clutter.
```

---

## 7. Apply section ("Request your invitation") — form fixes & Dossier alignment prompt

*Triggered by a post-launch-prep review: the Apply section's two tier options currently render as bordered/filled pricing cards (violates the no-cards rule already locked in `04` §5/§12), the field set needs to pick up decisions made after the last build pass (Instagram field, Delegate Status default bug, HPAIR naming guardrail), and the section never received the Dossier marginalia the rest of the page has.*

```
Use the "taste" and "ui-ux-pro-max" skills. Focus exclusively on the Apply section ("Request your invitation" / #apply) of the home page — the dark threshold section with the application form. It currently works but has fallen out of step with two things: the Dossier system already locked elsewhere on the page, and a set of content/field decisions made after the last build pass. Fix both without touching any other section.

DO NOT
- Add cards, boxes, drop shadows, or gradients around the two application tracks — this section currently renders them as two bordered/filled boxes that read as pricing SKUs, which directly violates the system rule already locked in `04-design-foundation.md` §5 and §12: "no cards/boxes; depth via rules, alignment, type layering; matte only, never shadows."
- Show any price, number, or currency symbol on this section for either track. Neither ₹5,000 nor any VIP figure appears here — pricing lives only in the Tiers section upstream (already built).
- Rename, relabel, or expand any field to name an external organization, city, or program (see rule 3 below).
- Introduce new colors — ivory, ink, oxblood, and the dark threshold tone are the only four in the system.

1. APPLY-AS SELECTOR — replace the two pricing-card boxes with a Dossier-consistent toggle
Rebuild "VIP Delegate" / "Premium Observer" as a quiet, baseline-ruled toggle or tab pair — not boxes. Follow the label→value colophon logic already used elsewhere on the page (label small/tracked/secondary ink, value in the display or medium-weight grotesque). Selected state reads through a hairline underline or weight/ink shift — never a filled block or border. Heading above it: "Apply As" (not implied pricing). Keep the two descriptors exactly as locked: "Representing India abroad" (VIP) and "By application" (Observer).

2. FIELD SET — align exactly to the current locked spec, in this order
Full Name · Email · WhatsApp Number (+91 default) · LinkedIn Profile · Instagram Handle (NEW — required; label it "Instagram Handle" with microcopy "Used to tag you in event content") · University / Organisation · Domain (existing 7 options: Governance, AI, Tech, Leadership, Healthcare, Finance/VC, Other — unchanged) · City (unchanged — do not rename to "City, Country," the applicant pool is India-only) · Delegate Status (VIP-branch only, conditionally shown when "VIP Delegate" is selected).

3. DELEGATE STATUS FIX — remove the default-selection bug, keep naming generic
The field currently defaults to a pre-selected value (reads as "Accepted"), which lets anyone self-certify without making a choice. Fix: no default value — force an explicit selection via a neutral placeholder ("Select one"). Keep the label generic — "Delegate Status" with options "Accepted / Applied" exactly as already specified. Never expand this label or its options to name any external program, organization, or city (e.g. never a label like "HPAIR Status") — this is a binding compliance rule, not a style choice.

4. CONSENT CHECKBOXES — preserve exactly, do not regress
The two mandatory checkboxes (media waiver, privacy consent) already exist in the current build and must remain — confirm both are visually present, both block the submit button until checked, and the privacy checkbox links to /privacy and /terms. Do not let the toggle/field restyling in steps 1–3 crowd or visually demote these.

5. DOSSIER SYSTEM — bring this section in line with the rest of the page
Every other section carries running marginalia (page numeral, section Roman numeral + hairline eyebrow, running foot "THE PEDIMENT · MMXXVI"). This section currently doesn't. Add it: a section numeral in sequence with the rest of the page, an eyebrow like "IX · THE INVITATION ———" above the headline, and the running foot in the corner, matching the weight/placement rules already established in the Page 2 and Act 3 prompts. Matte only — no shadows or cards to create this hierarchy, only rules, alignment, and ink-weight layering.

6. SUBMIT — copy and state
Button label: "Submit Application." Disabled state shows the existing tooltip copy ("Please accept the media waiver and privacy terms to continue"). Loading/submitting state blocks double-submit, per the existing form spec.

Keep everything else locked: warm ivory/dark-threshold palette exactly as used elsewhere, oxblood used only per the sparing rules already established, honesty rules (no affiliation claims, no VIP price shown, mandatory consents), exactly two CTAs sitewide (this section is the terminal one). Show desktop 1440 + mobile 390. When unsure, subtract.
```

---

## 8. Folio VI ("What the evening gives you") — composition & narrative-spine refinement

*Nick's read (via ChatGPT critique, filtered): the five-commitment Experience section is static and repetitive — same title-left/body-right pattern five times, large dead center-page space, the recurring diagonal line does nothing. Kept: staggered composition, the line as a real spine, varied per-commitment layout, sharper type hierarchy, restrained motion. Cut: blueprint/drafting-mark motifs (competes with the already-locked single Dossier device, same reason the vine motif was rejected in `04` §11) and "hands exchanging cards"-style stock photography (banned by the imagery rules; no real event photos exist yet to be honest with).*

```
Use the "taste" and "ui-ux-pro-max" skills. Focus exclusively on Folio VI — "What the evening gives you" (the five-commitment Experience section, currently marked "No. 06 · The Evening" / "FOLIO VI"). The Dossier marginalia here (top folio reference, bottom colophon "VOL. I · BANGALORE · 5 AUGUST 2026 · MMXXVI") is correct and must stay exactly as-is — the problem is the content zone in between: it currently reads as a rigid, repeated three-column list (title left, body far-right, same pattern five times), leaving the curved line as pure decoration and large stretches of dead center-page space. Fix the composition and give the line a real job — do not touch any other section.

DO NOT
- Introduce a second ownable visual system. No blueprint overlays, drafting marks, construction geometry, or measurement-tick motifs — that borrows an architectural/technical-drawing register that competes with the one signature system already locked (The Dossier / bound-edition), for the same reason the vine motif was rejected in `04-design-foundation.md` §11. If you want structural/informational marks, use Dossier-native devices instead: archive stamps, folio cross-references, registration numbers — not blueprint language.
- Use any "networking" stock-photo imagery — no hands exchanging cards, no generic "elegant event moment" featuring people. No real event photography exists yet (pre-event), and staging a fake one breaks the honesty rules already locked. If a photographic element is added, it must be matte, material imagery — texture, light, architectural abstraction — per the imagery rules in `04` §7, not a posed human scene.
- Add gloss, shine, or any lighting effect that reads as a digital sheen. The marble/paper texture must stay matte throughout, even when it shifts.
- Change, trim, or rewrite any of the five commitment titles or their body copy, or the travel-grant disclaimer ("Conditional — awarded from surplus, not guaranteed.") — this is locked, honesty-critical copy from `03-website-content-and-ia.md` §5. This pass is re-composition only, zero copy changes.
- Introduce new colors. Ivory, ink, secondary stone, and oxblood are the only tokens available here.

1. THE CURVED LINE — from decoration to narrative spine
The diagonal hairline already running through this section (and echoed elsewhere on the page) becomes the section's structural backbone, not an ambient mark. Each of the five commitments anchors to a specific point along its path — like waypoints — so the eye is pulled from one to the next in sequence as it travels down the curve, rather than jumping between five identical disconnected blocks. On scroll, the line draws progressively (150–300ms per segment, ease-out per the site's motion tokens) as each commitment enters view; honor `prefers-reduced-motion` with an instant, fully-drawn fallback.

2. BREAK THE REPEATED TEMPLATE — five commitments, five compositions
Currently every commitment uses the same title-left/body-right pattern. Vary it, commitment by commitment, while keeping an underlying consistent grid (this is asymmetry via selection, not freeform chaos — per `04` §4):
   - Give 1–2 commitments a pull-quote treatment (the title set large and sculptural, standing alone against negative space, body copy positioned as a smaller aside rather than a paired column).
   - Give at least one commitment a numbered-callout treatment tying it explicitly to its position in the sequence (e.g. a Roman numeral or archive-style registration mark sitting beside it — Dossier-native, not blueprint-native).
   - Stagger vertical position and horizontal alignment across the five, so nothing lines up on the same axis twice in a row — deliberate asymmetry, not a repeating grid.
   - Keep the travel-grant disclaimer's visual weight intact or stronger than today — do not let it shrink into invisibility during re-composition; it is required disclosure, not filler.

3. TYPOGRAPHY — sharpen the hierarchy
Commitment titles grow larger and more sculptural (they are the visual anchors on the line); body copy stays light-weight and quiet by comparison. Use italic emphasis sparingly on a phrase within one or two bodies for texture — not on all five uniformly. No repetitive heading-then-paragraph rhythm; let at least one commitment's copy break into a short standalone line before its fuller body text.

4. EDITORIAL MARKS — deepen the existing Dossier vocabulary, don't add a new one
Where you want small moments of discovery, use marks already licensed by the system: a faint oversized Roman numeral "VI" as a background watermark (same technique as the Page 2 ghost-numeral device), folio cross-references, a small archive-style annotation or registration number near one commitment. All at 3–5% opacity against ivory, never competing with body-text contrast. This is the same "depth through layering, not decoration" principle already used on Page 2 — apply it here, don't invent a parallel language.

5. ONE RESTRAINED VISUAL ELEMENT
If you introduce imagery to break the text rhythm, make it a single narrow architectural or material crop (stone/marble detail, light on texture) sized to occupy one column's worth of space — not a stretched hero image, not a posed human photograph. Optional — only add it if it doesn't crowd the curved-line composition.

6. MOTION
Progressive fade-in per commitment as it enters view, gentle upward settle (not a generic fade-up — tie the motion to "arriving at its waypoint on the line"), very subtle background parallax on the texture layer only (never on text). All durations 150–300ms, ease-out per the site's existing motion tokens. Full `prefers-reduced-motion` fallback: instant states, fully-drawn line, no parallax.

Keep everything else locked: the top folio marginalia and bottom colophon exactly as built, warm ivory palette with oxblood used sparingly, all five commitment titles and bodies verbatim, the travel-grant disclaimer's exact wording and clarity, 8px spacing scale, 12-col grid. Show desktop 1440 + mobile 390. When unsure, subtract — add composition, not clutter.
```

---

## 9. Folio IX ("Questions, answered") — FAQ restructure for 20 questions + copy sync

*Content grew from 10 to 20 questions (brand-entity, eligibility, and policy questions added in `03-website-content-and-ia.md` §8) and "young"/"youth" was purged sitewide in favor of "emerging." The FAQ is a reference/index section, not a narrative one — the fix here is information architecture (grouping, scanability) and a copy sync, not a mood/motion overhaul like Folio VI.*

```
Use the "taste" and "ui-ux-pro-max" skills. Focus exclusively on Folio IX — "Questions, answered" (the FAQ / #faq section, currently "No. 09 · Correspondence" / "FOLIO IX"). Two things changed since this was built: the FAQ grew from 10 to 20 questions, and the word "young"/"youth" no longer appears anywhere in copy (replaced with "emerging"). This pass restructures the section to hold 20 questions without becoming a wall of text, and syncs every word to the current source doc. Do not touch any other section.

DO NOT
- Turn the three question groups into tabs, pills, cards, or a filter UI — that's a new interaction pattern this site has never used and reads as a SaaS help-center, not a bound-edition FAQ. Group via typographic section headers within the same continuous list, not a componentized switcher.
- Copy the Folio VI "narrative spine" treatment wholesale onto this section. Folio VI is narrative content where the line pulls the eye through a story; this is reference content where scanability and findability matter more than pacing. If the curved line appears here at all, it should mark the three part-transitions only, not all twenty individual questions — restraint over consistency-for-its-own-sake.
- Shrink, de-emphasize, or visually bury any answer relating to travel grants, HPAIR/external-conference affiliation, photography/media consent, refunds, or data use — these are compliance-load-bearing answers and must stay exactly as legible as any other question, not demoted because they're "less interesting."
- Invent, paraphrase, or shorten any question or answer text. Pull all twenty verbatim from `03-website-content-and-ia.md` §8 (current order below) — this pass is structure and copy-sync only.
- Introduce new colors or icons beyond the existing oxblood "+" expand marker.

1. GROUP THE 20 QUESTIONS INTO THREE PARTS (same continuous i–xx numbering, new part headers)
Keep the running lowercase-roman numbering (i through xx) unbroken across the whole list — don't restart numbering per group. Insert three quiet, all-caps tracked part-headers (matching the register of existing marginalia like "FOLIO IX" / "VOL. I") directly above each group's first question, with a hairline rule beneath:

   PART ONE — THE GATHERING (i–viii): What is The Leadership Prologue 2026? / When and where is it? / Who attends? / Can international applicants apply? / Is there a minimum age to attend? / Are travel grants guaranteed? / Will the evening be photographed? / What is the dress code?

   PART TWO — THE PEDIMENT (ix–xiii): What is The Pediment? / Is The Leadership Prologue 2026 the same as The Pediment? / How is The Pediment different from other leadership summits? / Who is behind The Pediment? / Is the summit affiliated with any international conference?

   PART THREE — APPLYING & POLICY (xiv–xx): How do I attend? / Can I apply if I wasn't personally invited? / What does it cost? / What is the refund policy for Premium Observer seats? / What happens if the event date or venue changes? / I represent a company or fund — can we partner? / How is my data used?

2. COPY SYNC — pull exact current text
Every question and answer must match `03-website-content-and-ia.md` §8 verbatim as of this update, including the ten new entries and the "emerging" wording throughout. Do not carry over any old "young leaders" or "youth talent" phrasing from a prior build pass.

3. THE CURVED LINE — restrained, structural use only
If the existing diagonal hairline threads through this section, let it mark the two part-transitions (between PART ONE/TWO and PART TWO/THREE) as a quiet crossing point, not a waypoint system for all twenty items. This section's job is fast scanning, not a guided journey.

4. ACCORDION BEHAVIOR — unchanged
Keep the existing pattern: collapsed by default, oxblood "+" marker rotates or shifts to indicate open/closed on click, one question open at a time or independently — whichever is already implemented. Expand/collapse transitions stay at 150–300ms ease-out per the site's motion tokens, full `prefers-reduced-motion` fallback (instant open/close).

5. DENSITY CHECK
With double the questions, tighten vertical rhythm slightly between collapsed rows (within the 8px spacing scale — don't invent new spacing values) so the collapsed list doesn't require excessive scrolling to reach Part Three, while keeping each question comfortably tappable (44px minimum touch target, per `04` §8).

Keep everything else locked: top folio marginalia ("No. 09 · Correspondence" / "FOLIO IX") and bottom colophon exactly as built, warm ivory palette, oxblood used only for numerals/markers/part-header rules, italic roman-numeral treatment on question indices. Show desktop 1440 + mobile 390. When unsure, subtract.
```

---

## 10. Handoff export — real source code for Emergent (not a Figma/design export)

*Purpose: the site is moving from Claude Design to Emergent for backend wiring (Supabase, forms, email) and launch. The animation work — Act 1→2→3 threshold crossing, the Folio VI narrative-spine line, the Folio IX accordion — is the hard-won part and the thing most likely to get lost in translation. A Figma or static export would strip all of it; only the real running code preserves it exactly. This prompt is a deliverable/export request, not a design-refinement request.*

```
This project is moving from Claude Design to Emergent to get a backend (Supabase, forms, transactional email) wired up and go live. I need the real, buildable source code — not a design file, not a static export, not a preview link that only runs inside Claude Design.

0. PUSH DIRECTLY TO MY GITHUB REPO
Push the full source directly to this private repo: https://github.com/futureworksnik-lab/The-Pediment-Website — push to `main` (or open a PR against `main` if that's your default flow; either is fine, just tell me which you did). If you don't have write access to push directly, say so explicitly and instead give me the exact local commands to push it myself (`git remote add`, `git push`, etc.) rather than leaving me to guess. Either way, still package the same content as a downloadable .zip as a backup in case the push fails or is partial.

DELIVER THE FOLLOWING, PACKAGED AS A SINGLE DOWNLOADABLE PROJECT (.zip) AND/OR PUSHED TO THE REPO ABOVE:

1. FULL SOURCE, AS-IS
Every file needed to build and run this exactly as it looks and behaves right now: all HTML/CSS/JS or React/TSX components, the full stylesheet or design-token file, every asset (images, textures, the paper-grain/marble textures used across sections), and every font file or font-loading reference (if fonts are loaded from a CDN like Google Fonts, tell me explicitly which ones and confirm the exact weights/styles in use — Fraunces and Hanken Grotesk per the design system).

2. CONFIRM WHAT THIS ACTUALLY IS
State plainly, in the first line of your response: is this real, runnable code (e.g. "this is a Next.js/React project, run `npm install && npm run dev`") or is it something that only renders inside Claude Design and cannot run standalone? I need the honest answer even if it's the second one — if it's not portable as real code, tell me now so I can plan around it, don't let me discover it after handoff.

3. ANIMATION IMPLEMENTATION — be specific
For each of the following, tell me exactly how it's built and what it depends on:
   - The Act 1 → Act 2 → Act 3 threshold-crossing / page-turn sequence on the home page.
   - The Folio VI curved-line narrative spine (draws progressively as commitments enter view).
   - The Folio IX FAQ accordion open/close behavior.
   List any external animation library in use (e.g. Framer Motion, GSAP, native CSS transitions/keyframes, IntersectionObserver-driven JS) and confirm it's included in the exported package's dependency list (package.json or equivalent) so nothing breaks silently when this is rebuilt elsewhere.

4. A HANDOFF README (include as a file in the export)
Write this as if briefing another engineer who has never seen the project:
   - Stack/framework used and exact run instructions (install, dev server, build).
   - Folder structure — where sections/components live, where design tokens (color/type/spacing) are defined, where assets and fonts live.
   - Which parts are fully functional right now vs. which are placeholder/mocked (e.g. is the application form's submit action wired to anything, or does it need a real backend call added — be explicit, this determines what Emergent still has to build).
   - Any known gaps, rough edges, or sections you weren't fully confident in.

5. FIDELITY CHECKLIST
Confirm, section by section (Hero/Act1-3, About, Prologue, Pillars, Experience/Folio VI, Tiers, Speakers, FAQ/Folio IX, Apply, Footer), that what's in this export matches the latest approved state — including the Apply section field/toggle fixes and the Folio IX 20-question restructure with "emerging" wording, if those passes are complete. Flag anything that didn't make it into this export so I know before it goes to Emergent, not after.

Do not regenerate, "clean up," or reinterpret anything during export — I want the exact code that produces the exact design and motion already approved, packaged for someone else to run.
```
