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

## Status update — handoff to Emergent (post Claude Design export)

Source pushed to `https://github.com/futureworksnik-lab/The-Pediment-Website` (main). Exported bundle is a **static HTML/CSS/JS "Design Component"** (`index.html` + `support.js` + `assets/`), not an npm/React project — Emergent must treat it as the exact approved frontend, not regenerate it.

**Known gaps confirmed by Claude Design at export time:**
- No Act 1→2→3 choreographed page-turn — home page is continuous scroll with reveals + the Folio VI thread-line draw instead. **Decision: ship without it; revisit as a post-launch enhancement, not a blocker.**
- Application form submit is not wired to any backend (shows a thank-you state only, no real insert).
- "young"/"youth" purged sitewide as of this export — zero remaining instances, verified.
- Legal pages (`/privacy`, `/terms`, `/refunds`, `/cookies`), `/partners`, `/waitlist`, `/thank-you`, and all AEO/SEO infrastructure (JSON-LD, `llms.txt`, sitemap, robots.txt, cookie-consent banner, analytics events) were **never built during the Claude Design phase** — only the home-page long-scroll sections were designed. These are new build work for Emergent, not just backend wiring.

## Emergent kickoff prompt (paste as-is)

```
Read every file in the attached "website/" folder before writing any code — 01-PRD.md, 02-system-and-information-architecture.md, 03-website-content-and-ia.md, 04-design-foundation.md, 06-handoff.md. These are the single source of truth for scope, data model, copy, and design system. Also review modules/07-delegate-supply-and-ticketing.md and modules/04-legal-entity-and-compliance.md for the business/compliance rules behind the forms.

Then clone and inspect the repo: https://github.com/futureworksnik-lab/The-Pediment-Website (main branch). This repo contains the approved frontend as a static HTML/CSS/JS bundle (index.html + support.js + assets/) — it is not an npm/React project. Do not regenerate, restyle, or "improve" any existing visual design, copy, or animation in it. Treat it as locked and final for every section it already contains: Hero, About, Prologue, Pillars, Experience (Folio VI), Tiers, Speakers, FAQ (Folio IX, 20 questions), Apply, Footer.

Before writing any code, respond with a build plan / checklist covering everything below, so I can review and approve it before you start.

WHAT ALREADY EXISTS — preserve exactly, wire don't rebuild:
- All home-page sections listed above, including fonts (Fraunces + Hanken Grotesk, Google Fonts CDN, weights 300–700 roman+italic), the warm ivory/oxblood/dark-threshold palette, and existing animations (scroll reveals, Folio VI thread-line draw, Folio IX accordion).
- The application form's field set and validation rules exactly as built: Full Name, Email, WhatsApp (+91 default), LinkedIn, Instagram Handle, University/Organisation, Domain (Governance/AI/Tech/Leadership/Healthcare/Finance-VC/Other), City, Delegate Status (VIP-branch only, no default value, options "Accepted"/"Applied" — never rename or expand this field to name any external organization), media waiver checkbox, privacy consent checkbox (both mandatory, block submit until checked).

WHAT YOU NEED TO BUILD — this is real net-new work, not just backend wiring:
1. Supabase backend: two tables, `applications` and `partner_inquiries`, exact schema in `02-system-and-information-architecture.md` §4. Row-level security on; the public/anon key is INSERT-only on both tables, no read access from the client. Reads happen only via the Supabase dashboard or a service_role key used server-side, never exposed to the browser. Store keys as environment variables, not in the repo.
2. Wire the application form's submit to a real Supabase insert (currently it only shows a thank-you state with no backend call). On success: redirect to `/thank-you`, fire a conversion analytics event, and trigger an auto-confirmation email from hello@thepediment.com — VIP Delegate and Premium Observer get different copy, exact text in `03-website-content-and-ia.md` §14.
3. Build the pages that don't exist yet, reusing the same design system, tokens, and Dossier marginalia already established in the home page (do not invent a new visual style for these):
   - `/thank-you` (confirmation state, copy in `03` §10)
   - `/waitlist` (seats-nearly-full state, copy in `03` §11) — triggered when VIP capacity is reached; still captures applicant data
   - `/partners` (Partner inquiry form, copy in `03` §12: Name, Organisation, Work email, Role, Interest select, Message, privacy consent → inserts to `partner_inquiries`)
   - `/privacy`, `/terms`, `/refunds`, `/cookies` (legal pages, draft copy in `03` §13 — flag clearly in your build plan that this is draft copy pending lawyer/CA review, don't treat it as final legal advice)
4. Cookie consent banner gating analytics scripts until accepted (copy in `03` §13.4).
5. Analytics events per PRD FR-11: view, scroll_50, scroll_90, apply_start, apply_submit, partner_submit. Lightweight tool (GA4/Plausible-class).
6. Anti-spam: honeypot field + rate limiting on both the application and partner forms.
7. AEO/SEO infrastructure — none of this exists in the current bundle, build all of it:
   - JSON-LD in `<head>`: Organization, Event (with the current date/location/offers), and FAQPage schema mirroring the full, current 20-question FAQ verbatim from `03` §8 — not a stale or partial copy.
   - `llms.txt` at root — exact content in `03` §15.
   - `sitemap.xml`, permissive `robots.txt`.
   - Meta description, OG/Twitter cards, canonical URLs.
8. Domain: this will go live at thepediment.com — flag what you need from me (DNS records, etc.) to point it at your hosting once the above is complete.

HARD COMPLIANCE RULES — never violate these while building, even incidentally:
- Never name HPAIR or Hanoi anywhere participant-facing or public — not in copy, form labels, dropdown values, emails, or generated schema. If you're unsure whether new text you're generating (e.g. an error message) might reference it, don't — use "the international delegate programme" instead.
- Never show a VIP Delegate price anywhere public. Only the Premium Observer "Inaugural Early Access — ₹5,000, non-refundable" price is ever shown.
- Travel grants are always described as "up to five, funded from partner surplus, conditional — not guaranteed." Never state them as fixed or guaranteed.
- Never use the words "young" or "youth" anywhere — the current copy has zero instances; keep it that way in anything you generate (error states, alt text, meta descriptions, etc.). Use "emerging" if the concept is needed.
- Speakers/partners section shows only confirmed names — holding-state copy otherwise, never placeholder logos presented as real.
- Every application submission must carry both consent booleans (media waiver + privacy) with a timestamp — never allow a submission to bypass either checkbox.

OUT OF SCOPE for this pass: do not attempt to build the Act 1→2→3 choreographed page-turn transition — the site intentionally ships with continuous scroll + reveals for this launch. That's a possible future enhancement, not part of this build.

Give me the build plan first. Once I approve it, proceed section by section and tell me what's done after each one rather than going silent until the end.
```
