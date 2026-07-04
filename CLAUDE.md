# CLAUDE.md — The Pediment (Full-Stack Project Guide)

Single source of truth for the whole project. Claude Code is the technical lead for
frontend, backend, and deployment (ownership transferred from the earlier Emergent
track in July 2026 — the old "backend only, never touch the frontend" rule is retired).

## Project Overview

**The Pediment** runs **The Leadership Prologue 2026** — an invitation-first,
single-evening leadership summit in Bangalore on 5 August 2026 (thepediment.com).
The site's one job: convert visitors into applications (VIP Delegate / Premium
Observer) and partner inquiries. No accounts, no payments on-site at launch
(Observer payment links are sent manually after selection).

- Product/strategy docs: `modules/` (business model, ticketing, compliance, risk)
- Website spec: `website/` — `01-PRD.md`, `02-system-and-information-architecture.md`
  (data model §4), `03-website-content-and-ia.md` (ALL copy — final), `06-handoff.md`
- Locked design source: `handoff/The Pediment - Website.dc.html` (+ `support.js` runtime).
  The built site in `frontend/public/` is a faithful 1:1 vanilla port of it — verified
  by audit July 2026. Do not restyle, rewrite copy, or change animations.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Static HTML + CSS + vanilla JS (no framework, no build step) |
| Fonts | Google Fonts: Fraunces + Hanken Grotesk |
| Backend | Supabase Edge Function `apply` (Deno/TypeScript) — the ONLY API |
| Database | Supabase Postgres, RLS deny-all, service-role inserts from the function |
| Email | ZeptoMail (Zoho) transactional, from hello@thepediment.com |
| Analytics | Plausible (cookie-consent-gated), 6 custom events |
| Hosting | Vercel (static), domain on Cloudflare DNS |

## Project Structure

```
frontend/public/          ← the deployable site (Vercel outputDirectory)
  index.html              ← the long-scroll home page (12 folios) + JSON-LD
  apply/ thank-you/ waitlist/ partners/    ← flow pages
  privacy/ terms/ refunds/ cookies/        ← legal pages (draft, pending lawyer)
  css/style.css           ← entire design system (tokens in :root)
  js/main.js              ← animations + forms + analytics + cookie banner
  assets/                 ← 7 approved PNGs
  llms.txt sitemap.xml robots.txt
supabase/migrations/      ← schema (apply via mcp__supabase__apply_migration)
supabase/functions/apply/ ← the Edge Function source
vercel.json               ← static config: cleanUrls, security headers, cache
deliverables/             ← BACKEND-HANDOFF.md, DEPLOYMENT-CHECKLIST.md, plausible.html
handoff/ website/ modules/ ← design source + specs (read-only references)
```

## Frontend Architecture

- Every page is standalone HTML sharing the same header/footer chrome and
  `css/style.css` + `js/main.js`. No templating — when editing shared chrome,
  update ALL pages (grep for the changed string).
- `js/main.js` is one IIFE with feature-detected setup functions: each `setup*()`
  no-ops if its DOM isn't present, so one script serves every page. It contains:
  the three approved animations (scroll-reveal `.rv`, diagonal thread SVG, Folio VI
  spine), apply form, partner form, thank-you tier copy, cookie banner, Plausible
  loader, scroll-depth events.
- Routing is clean URLs via directory `index.html` files (`/apply` →
  `apply/index.html`). `vercel.json` sets `cleanUrls: true`.
- Design tokens live in `:root` of `style.css` (`--ink #17130E`, `--paper #F3EEE3`,
  `--ox #5E2029`, `--goldB #E9D3A6`…). One responsive breakpoint at 1080px plus a
  560px header/cookie tweak. Do not add frameworks or new fonts.

## Backend Architecture / API Structure

One public endpoint, no auth, no key on the frontend:

```
POST https://kxxoapufmqzgchcaqyqe.supabase.co/functions/v1/apply
```

- Body `form: "application"` → validates 12 fields, checks honeypot `nickname`
  (must be empty), rate-limits (3/email/10min), counts tier rows vs seat cap,
  inserts into `applications`, sends confirmation email, returns
  `{ ok: true, redirect: "/thank-you" | "/waitlist" }` (waitlist still inserts).
- Body `form: "partner_inquiry"` → same pattern into `partner_inquiries`.
- Errors: `{ ok: false, error: "…" }` with 4xx/5xx. Frontend preserves input and
  shows the error inline.
- Frontend sends `tier: "vip" | "obs"`; the function maps to
  `vip_delegate` / `premium_observer`.
- Deploy function: `mcp__supabase__deploy_edge_function` from
  `supabase/functions/apply/`. Schema changes: `mcp__supabase__apply_migration`
  from `supabase/migrations/`. After any DDL run `mcp__supabase__get_advisors`
  (security) — zero findings expected.

## Database (Supabase)

Project ref `kxxoapufmqzgchcaqyqe`. Tables: `applications`, `partner_inquiries`
(see `supabase/migrations/0001_init.sql`). RLS ON with zero anon policies —
nothing is readable/writable from browsers; only the service role (inside the
Edge Function) writes. There is deliberately **no anon key anywhere**; never
introduce one without a design decision.

## Authentication & Storage

None, by design. No user accounts, no file uploads. Don't add Supabase Auth or
Storage unless the product changes.

## Environment Variables (Edge Function secrets — never commit)

| Var | Purpose |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | auto-injected by Supabase |
| `ZEPTOMAIL_TOKEN` | ZeptoMail API token; unset ⇒ emails skipped (logged), inserts still succeed |
| `VIP_SEAT_CAP` (default 100), `OBSERVER_SEAT_CAP` (default 50) | at/over cap → `/waitlist` redirect (row still inserted) |
| `ALLOWED_ORIGINS` | comma-separated CORS allowlist (prod + www + Vercel previews) |

The frontend needs no env vars — the function URL is hardcoded in `js/main.js`
(it is public, not a secret).

## Email Automation

Three transactional emails, sent by the Edge Function on successful insert, copy
verbatim from `website/03-website-content-and-ia.md` §14: VIP confirmation,
Observer confirmation (mentions ₹5,000 payment link to follow), partner
acknowledgement. From `hello@thepediment.com` via ZeptoMail. Email failure never
fails the request. SPF/DKIM/DMARC DNS records required (see deployment checklist).

## Deployment

Full beginner-friendly runbook: `deliverables/DEPLOYMENT-CHECKLIST.md`.
Short version: Vercel imports the GitHub repo (static, `outputDirectory
frontend/public`), Cloudflare DNS points thepediment.com to Vercel, ZeptoMail +
Zoho handle email (DNS records), Plausible site registered, Edge Function secrets
set (`ALLOWED_ORIGINS`, `ZEPTOMAIL_TOKEN`, seat caps). Backend is already
deployed and live.

## Analytics

Plausible, loaded ONLY after cookie-banner Accept (`js/main.js
setupCookies`/`loadAnalytics`; choice persisted in `localStorage
pediment_cookie_consent`). Events: `view`, `scroll_50`, `scroll_90`,
`apply_start`, `apply_submit` (props: tier), `partner_submit`. All calls go
through `window.trackEvent`, which is a no-op until consent.

## Coding Standards

- Vanilla ES5-style JS (IIFE, `var`), matching the existing file — no build step,
  no dependencies, no frameworks.
- Copy is LOCKED: any user-facing text must come verbatim from
  `website/03-website-content-and-ia.md`. Never invent copy.
- Keep `data-testid` attributes on interactive elements.
- Match the existing minimal-whitespace HTML style; keep pages self-contained.

## Non-negotiable Content/Compliance Rules

Apply to ALL machine-generated text (pages, errors, emails, logs) — checklist in
`website/03-website-content-and-ia.md` §15:

- Never name **HPAIR** or **Hanoi** or any external conference anywhere
  participant-facing ("the international delegate programme" if needed).
- Never use "young"/"youth" — use "emerging."
- Never show a VIP Delegate price. Only "Inaugural Early Access — ₹5,000,
  non-refundable" (Premium Observer) is ever public. No "early bird" wording.
- Travel grants: always "up to five, funded from partner surplus, conditional —
  not guaranteed."
- `delegate_status` values stay generic (`Accepted`/`Applied`).
- Every application must carry `media_waiver_consent` AND `privacy_consent` true —
  enforced in UI and server; never bypass.
- Only confirmed speakers/partners shown; otherwise holding state.
- Pre-deploy gate: `grep -rniE "hpair|hanoi|\byoung\b|\byouth\b" frontend/ supabase/`
  must return nothing.

## Development Workflow

1. Branch from `main` (`feat/…`). Never commit directly to `main`.
2. Frontend: edit `frontend/public/`, test with
   `python3 -m http.server` (or `npx serve`) from `frontend/public/`.
3. Run the compliance grep + click through changed pages before committing.
4. Backend: edit `supabase/functions/apply/`, deploy via MCP, verify with the
   curl suite in `deliverables/BACKEND-HANDOFF.md`.
5. PR to `main`; Vercel builds previews per PR once connected.

## Future Improvements (explicitly deferred — do not build unasked)

- Razorpay/UPI payment gateway for Observer seats (fast-follow after launch).
- Act 1→2→3 choreographed page-turn scroll (ships later; current reveals are approved).
- Speaker/partner grid (needs confirmed names; holding state until then).
- Social links (footer `#` placeholders until user provides handles).
- Legal pages reviewed by lawyer/CA (current copy is structured draft).
