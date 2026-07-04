# The Pediment — The Leadership Prologue 2026 Website

## Original problem statement
Port the approved React "Design Component" export (`The Pediment - Website.dc.html` /
`handoff/index.html`, repo: github.com/futureworksnik-lab/The-Pediment-Website) into a
pure static HTML/CSS/vanilla-JS site (zero React, AEO-crawlable) in 3 phases:
- **Phase 1** — frontend preservation (locked visual/copy/animation port + 6 known bug fixes)
- **Phase 2** — net-new pages (/thank-you, /waitlist, /partners, /privacy, /terms, /refunds,
  /cookies, cookie-consent banner)
- **Phase 3** — AEO/SEO infra (JSON-LD, llms.txt, sitemap, robots) + wiring both forms to the
  real Supabase Edge Function + Plausible analytics events

Backend (Supabase, Edge Function, email, Plausible) built separately by another team —
already deployed and verified as of 2026-07-04. Contract: `deliverables/BACKEND-HANDOFF.md`
and `deliverables/plausible.html` in the source repo (cloned to `/app/repo_inspect/`).

## Hard compliance rules (never violate)
- Never name HPAIR/Hanoi anywhere public-facing.
- Never show a VIP Delegate price — only Observer "Inaugural Early Access — ₹5,000,
  non-refundable."
- Travel grants always "up to five, funded from partner surplus, conditional — not guaranteed."
- Never use "young"/"youth" — use "emerging."
- Speakers/partners: confirmed names only, holding-state copy otherwise.
- Both consent booleans (media waiver + privacy) mandatory on every application submission.

## Architecture decision (user-approved)
Pure static site, no React, no FastAPI logic. `/app/frontend/public/` holds all site files;
`frontend` supervisor process (port 3000) runs the `serve` npm package (cleanUrls) instead of
CRA. `/app/backend` is an idle FastAPI shim (health check only) kept alive to satisfy the
supervisor contract — no business logic, since all real form handling lives in the external
Supabase Edge Function.

Design tokens (live `:root`, used exactly, not the incomplete `04-design-foundation.md`):
`--ink:#17130E --ink2:#120F0B --inkT:#1C1917 --paper:#F3EEE3 --paperR:#FAF6EC --ox:#5E2029
--oxRed:#8A3541 --gold:#C9A76B --goldB:#E9D3A6 --stone:#57503F --ivory:#F1EBDF
--ivMut:rgba(241,235,223,.72)`. Fonts: Fraunces + Hanken Grotesk via Google Fonts CDN.

## What's been implemented (Phase 1 — 2026-07-04)
- `/app/frontend/public/index.html` — full home page port: Cover, Premise, Gathering,
  Prologue, Pillars, Experience/Folio VI, Tiers, Speakers, FAQ/Folio IX (20 Qs), Apply,
  Footer. Semantic fixes: single `<h1>` = "The Leadership Prologue 2026" (Premise section,
  not the Cover wordmark), `<main>` wrapper, `<header>/<nav>`, `<footer><nav>`, correct
  h1→h2→h3 order, `aria-hidden` on all decorative bg/scrim/svg elements.
- `/app/frontend/public/apply/index.html` — standalone crawlable `/apply` route (header +
  form + footer only).
- `/app/frontend/public/css/style.css` — verbatim extracted design tokens + all CSS rules.
- `/app/frontend/public/js/main.js` — vanilla JS port of: scroll-reveal (IntersectionObserver
  on `.rv`/`.evrv`), header dark/light flip, diagonal thread-line SVG draw, Folio VI
  narrative-spine draw + parallax, Apply form (tier toggle, checkbox state, validation,
  local confirmation swap — no network call yet, that's Phase 3).
- 6 known bugs: (1) Terms/Privacy links → `/terms`/`/privacy` — fixed; (2) footer "Partner
  with us" → `/partners` — fixed; (3) footer legal links stay `href="#"` — deferred to
  Phase 2 as instructed; (4) `domain_sector` "Finance / VC" — preserved exactly; (5)
  `delegate_status` Accepted/Applied, no default — preserved; (6) phone `+91` placeholder
  only, not value — preserved.
- Meta tags added: `<title>`, meta description (draft, 149 chars, pending user approval),
  canonical, OG/Twitter cards, `lang="en"`.
- `data-testid` added to all interactive/informational elements.
- Assets: 7 texture PNGs copied to `/app/frontend/public/assets/`.
- Tested via `testing_agent_v3`: 100% pass, zero functional bugs. One cosmetic note (mobile
  header `.hcta` wraps at 390px) — inherited verbatim from locked source CSS, not fixed
  without explicit go-ahead (visual design is locked).

## Pending user decisions
- Meta description final approval (draft: "An invitation-first summit for India's most
  vetted emerging leaders across governance, leadership, tech, AI and healthcare. Bangalore,
  5 August 2026." — 149 chars).
- Whether to fix the mobile `.hcta` wrap cosmetic issue (currently matches locked source
  exactly, so left as-is).

## Prioritized backlog (phase-gated, awaiting go-ahead after each)
- **Phase 2** (not started): `/thank-you`, `/waitlist`, `/partners` (form), `/privacy`,
  `/terms`, `/refunds`, `/cookies` (draft copy, flagged as pending lawyer/CA review), cookie
  consent banner with `<!-- analytics-slot -->` gate. Wire footer legal links + partner
  form's privacy-consent links to these once built.
- **Phase 3** (not started): wire both forms to
  `https://kxxoapufmqzgchcaqyqe.supabase.co/functions/v1/apply` (contract in
  `deliverables/BACKEND-HANDOFF.md`), fire `trackEvent` analytics events (view, scroll_50/90,
  apply_start, apply_submit, partner_submit) via the Plausible snippet in
  `deliverables/plausible.html`, JSON-LD (Organization/Event/FAQPage), `llms.txt`,
  `sitemap.xml`, `robots.txt`. Domain cutover to thepediment.com (needs DNS from user).

## Reference materials
- Source repo cloned at `/app/repo_inspect/The-Pediment-Website/` (docs, backend handoff,
  Plausible snippet, original `.dc.html`/`index.html` reference bundle).
- `/app/handoff/` and `/app/website/` — mirrored copies of the same docs/assets.
