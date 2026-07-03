# Session Handoff — The Pediment Website

> Paste this into a new session to continue. Reflects state as of the design phase (Act 1 approved, Act 3 in refinement).

## Project
**The Pediment** (umbrella brand) → **The Leadership Prologue 2026** — a premium, invitation-first, single-evening leadership summit. **5 August 2026, Bangalore.** Two-sided: VIP delegates (India's vetted emerging leaders, by invitation) + Premium Observers (curated, paid) on supply; sponsors handled offline. Website = conversion-first landing page on thepediment.com. Source manual: `The Atrium Society/modules/` (The Pediment Execution Manual).

## Source-of-truth docs (`The Atrium Society/website/`)
- `00-website-index.md` — index + locked decisions
- `01-PRD.md` — objectives, roles (no auth), scope, functional reqs, payment, compliance, AEO
- `02-system-and-information-architecture.md` — sitemap, Supabase schema, forms, states, flows, AEO/SEO
- `03-website-content-and-ia.md` — final copy for every section, FAQ, forms, legal, `llms.txt`, confirmation emails
- `04-design-foundation.md` — design system
- `05-design-prompts.md` — Claude Design prompts + critiques
- `06-handoff.md` — this file

## Locked product decisions
Full multi-section long-scroll landing · delegate-only site + discreet "Partner with us" · **form-first** (no payment gateway yet — bank/entity pending) · only public price = **"Inaugural Early Access — ₹5,000, non-refundable, rate rises once it closes"** (₹2,000 VIP deposit is INTERNAL, never public) · **no login/accounts** · **Supabase** backend via private GitHub repo connected to Emergent · AEO built in (JSON-LD, llms.txt, SSR) · contact hello@thepediment.com · trading name "The Pediment."

## Non-negotiable honesty rules
No HPAIR/external-conference affiliation claim (independent framing until written approval) · travel grants always "up to 5, from surplus, conditional" · confirmed speakers only · media-waiver + privacy consent mandatory · postponement (never cancel) clause: seats carry over.

## Design direction — "Quiet Authority"
Warm ivory base `#F5F1EA` + dark punctuation `#16130F` · ink `#1C1917`, secondary `#57534E` · **deep oxblood accent `#5E2029`, used sparingly** · contemporary high-contrast serif (Fraunces/Canela) + humanist-warm grotesque (Hanken Grotesk) · 8px scale, 12-col grid, grid-first asymmetry · token-based · WCAG AA · restrained 150–300ms motion. Synthesized with NotebookLM's Vignelli critique (adopted its system discipline; rejected its dark-SaaS/International-Orange counter-proposal — reasons in `04` §11).

## Signature system — "The Dossier"
The site as a bound, numbered edition: framed page, running heads, section numerals (I–VI), colophon spec-blocks, Vol. I / MMXXVI, recurring threshold hairline. Must appear on **every** section.

## Design status
Building in Claude Design (using installed `taste` + `ui-ux-pro-max` skills). Home concept = **"The Threshold"**: Act 1 warm-ivory centered "THE PEDIMENT" title wall → Act 2 scroll-crossing → Act 3 Prologue hero.
- **Act 1 approved** (quality bar).
- **Act 3** was too generic → detailed critique + refinement prompt in `05` applies the Dossier system.

## Next step
Paste the Act 3 refinement prompt (`05` §3) into Claude Design → review against the Dossier system → build remaining sections in order: about → prologue → pillars → experience → tiers → speakers → FAQ → apply → footer, all to the same bar.

## Confirm before publish
Live hello@thepediment.com mailbox · venue (kept private) · social handles (LinkedIn/Instagram/X placeholders) · Supabase project + keys in Emergent · private GitHub repo created.
