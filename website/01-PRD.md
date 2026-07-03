# Product Requirements Document — The Pediment Website

> **The Leadership Prologue 2026** · Build spec · v2.0
> Single source of truth for the website. Written to be pasted directly into Emergent as build guidance.
> Legal copy is draft and should be lawyer/CA-reviewed before publish.

---

## 1. What we're building

A premium, single-page (long-scroll) landing site for **The Leadership Prologue 2026**, an invitation-first leadership summit by **The Pediment**. The site has one job: convert qualified visitors into **submitted applications**, and store clean, permissioned applicant data.

It is not a content portal, blog, or community platform. Every element serves one action: **request an invitation**.

**Event facts (canonical):**
- Name: The Leadership Prologue 2026
- Organiser: The Pediment
- Date: **5 August 2026**
- Location: **Bangalore, India**
- Format: single-evening, invitation-first leadership summit
- Themes: Global Governance · Leadership · Technology · AI · Healthcare (with a closing note on Climate)

## 2. Objectives & success metrics

| # | Objective | Metric | Target (validate live) |
|---|---|---|---|
| O1 | Convert traffic to applications | Visit → submit rate | ≥ 8–12% from warm traffic |
| O2 | Capture clean applicant data | Complete applications with LinkedIn + sector | Growing daily from launch |
| O3 | Sell Inaugural Early Access seats | Paid Observer confirmations | ~50 seats |
| O4 | Reinforce premium brand | Bounce / scroll depth / time-on-page | Low bounce; hero→apply completion tracked |
| O5 | Get cited by AI answer engines (AEO) | Appearances/citations in LLM answers for the event | Present in answers about the summit |
| O6 | Zero compliance incidents | Waiver + consent capture | 100% of submissions carry both consents |

## 3. Users & roles

No public authentication. "Roles" are segments, not login accounts.

| Role | Auth | Description | Action |
|---|---|---|---|
| Prospective applicant | None | Selected delegate or curated leader | Read → apply |
| VIP Delegate | None | Selected delegate representing India abroad | Apply via invitation/application; onboarding handled privately, then WhatsApp |
| Premium Observer | None | Curated national leader / professional | Apply → pay **Inaugural Early Access (₹5,000)** via link |
| Partner inquirer | None | Recruiter, brand, VC, CSR lead | Submit "Partner with us" inquiry → team follows up offline |
| Admin / team | Backend only | Founder, manager, designer | View/export data in Supabase; send payment links. No public UI. |

## 4. Scope

**In scope (launch):**
- One premium long-scroll landing page with sticky anchor nav.
- Application flow (VIP Delegate + Premium Observer), **form-first**.
- Discreet **"Partner with us"** inquiry path (light; partners close offline).
- Legal pages: Privacy, Terms, Refund, Cookies; media waiver inline + linked.
- Confirmation and waitlist states.
- Supabase backend for form data.
- AEO + SEO: structured data, semantic HTML, `llms.txt`, sitemap, OG.
- Responsive (mobile-first) + fast load.

**Out of scope:**
- Accounts, login, delegate portal, dashboards.
- On-site payment gateway at launch (bank/entity not yet live) — deferred; form-first + manual payment link now.
- Public sponsor pricing/tier pages.
- Blog, resource library, multi-event, multi-language.

## 5. Payment model (form-first)

- No embedded gateway at launch. Add a gateway (Razorpay/UPI) as a fast-follow once the business account is live.
- **Flow:** applicant submits → auto-confirmation email → team sends a manual payment link (Observer).
- **Public price:** only **Premium Observer** is priced publicly:
  > **Inaugural Early Access — ₹5,000. Non-refundable. Limited allocation; the rate rises once it closes.**
- The VIP delegate flow shows **no price**; VIP onboarding is handled privately after selection. Do not display any VIP fee on the site.

## 6. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Sticky nav, smooth-scroll anchors, persistent primary CTA | Launch |
| FR-2 | Hero: title, subtitle, date + location, primary CTA, scarcity cue | Launch |
| FR-3 | Application form with VIP/Observer branching + validation | Launch |
| FR-4 | **Mandatory** media-waiver checkbox — blocks submit if unchecked | Launch |
| FR-5 | **Mandatory** privacy/consent checkbox (DPDP Act 2023) — blocks submit | Launch |
| FR-6 | Submission persists to Supabase + triggers auto-confirmation email | Launch |
| FR-7 | Confirmation ("thank you") state with next steps | Launch |
| FR-8 | Scarcity cue; **waitlist state** when VIP capacity reached | Launch |
| FR-9 | "Partner with us" inquiry form → Supabase + team notification | Launch |
| FR-10 | Cookie consent banner gating analytics | Launch |
| FR-11 | Analytics events: view, scroll_50/90, apply_start, apply_submit, partner_submit | Launch |
| FR-12 | Responsive, mobile-first, fast (optimize hero media, lazy-load below fold) | Launch |
| FR-13 | AEO/SEO: JSON-LD (Organization, Event, FAQPage), semantic HTML, meta/OG, sitemap, robots, `llms.txt` | Launch |
| FR-14 | Server-rendered / statically generated content so crawlers + LLMs read it without JS | Launch |
| FR-15 | Anti-spam (honeypot + rate limit) on both forms | Launch |
| FR-16 | Payment gateway + automated refund logic | Fast-follow |

## 7. Data & forms

Collected at application (see schema in `02-system-and-information-architecture.md`).

**Application (core):** Full Name · Email · Phone (WhatsApp) · LinkedIn URL · University/Affiliation · Domain/Sector · City · Tier (VIP Delegate | Premium Observer) · HPAIR-track status (VIP branch) · media-waiver consent · privacy consent.
**Partner inquiry:** Name · Organisation · Work email · Role · Interest · Message · privacy consent.

**Principles:** collect only what's needed; store permissioned in Supabase; never lose a submission; aggregate/anonymize before sharing any summary with partners, full detail only after a signed agreement.

## 8. Compliance requirements

- **Media waiver** (mandatory checkbox): *"I consent to being photographed and recorded for promotional and commercial use by The Pediment and its official partners. I understand these assets may be distributed globally."*
- **Privacy Policy** — DPDP Act 2023: what's collected, purpose, sharing, retention, rights, grievance contact (**hello@thepediment.com**). Trading name: **The Pediment**.
- **Terms** — eligibility; application ≠ guaranteed admission; pricing; media rights; independence statement; conduct; liability; governing law (India).
- **Refund policy** — **Inaugural Early Access (₹5,000) is non-refundable.** No Observer refunds.
- **Cookie consent** — banner + policy; analytics load only after accept.
- **Content honesty rules (enforce in copy):**
  - **No claim of affiliation or endorsement by any external conference or organisation.** Use independent framing only. (The HPAIR name is added later, only after their written approval.)
  - **This applies to every participant-facing surface, not just body copy:** form field labels, dropdown option values, confirmation emails, WhatsApp scripts, social captions. Standing alias until approval: "the international delegate programme" / "delegates representing India abroad." Never name HPAIR or Hanoi on any of these surfaces (see `02-brand-and-positioning-system.md`, Public-copy substitution rule).
  - **Travel grants:** always "up to five, funded from partner surplus, conditional — not guaranteed."
  - **Speakers/partners:** show only confirmed names; otherwise a holding state.
  - Publish only confirmed facts; no manufactured affiliations or fixed guarantees.

## 9. AEO / answer-engine optimization

The site must be easy for LLMs and answer engines to read and cite:
- Server-rendered/static HTML; content readable without executing JS.
- One clear `<h1>`; logical heading hierarchy; semantic landmarks.
- JSON-LD: `Organization`, `Event` (with date, location, offers), `FAQPage`.
- A factual FAQ written in clean Q&A (canonical, self-contained answers).
- `llms.txt` at root summarizing the event's key facts.
- Descriptive meta description + OG/Twitter cards; canonical URLs; `sitemap.xml`; permissive `robots.txt` for reputable crawlers.
- Stable, descriptive URLs.

## 10. Constraints & platform

- **Platform:** Emergent (founder-owned). Code stored in a **private GitHub repo** on the founder's account (GitHub connected to Emergent).
- **Backend:** **Supabase** (Postgres) for form storage; connect to Emergent.
- **Domain:** thepediment.com.
- **Voice:** authoritative, exclusive, luxurious, editorial; restrained, not loud.
- **Reliability:** never lose a submission — the applicant database is the core asset.

## 11. Confirm before publish

1. Live mailbox for **hello@thepediment.com** (confirmations + grievance).
2. Venue (kept private; "announced to confirmed guests").
3. Social handles for LinkedIn / Instagram / X (placeholders in place until provided).
4. Supabase project + keys connected to Emergent; GitHub repo created (private).
