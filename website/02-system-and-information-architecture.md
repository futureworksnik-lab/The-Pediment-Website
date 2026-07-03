# System & Information Architecture — The Pediment Website

> **The Leadership Prologue 2026** · v2.0 · Pairs with `01-PRD.md` and `03-website-content-and-ia.md`.
> Sitemap, page/section map, Supabase data model, form schema, states, flows, integrations, AEO/SEO + compliance architecture. Written for direct use in Emergent.

---

## 1. Sitemap

Single long-scroll landing page + utility/legal routes. No authenticated area.

```
thepediment.com/
├── /  (Home — long-scroll landing)
│   ├── #hero
│   ├── #about        (What is The Pediment)
│   ├── #prologue     (The Leadership Prologue vision)
│   ├── #pillars      (5 themes + Climate closing note)
│   ├── #experience   (What delegates get)
│   ├── #tiers        (VIP Delegate / Premium Observer)
│   ├── #speakers     (Confirmed only / holding state)
│   ├── #faq
│   └── #apply        (Application form)
│
├── /apply            (Standalone application route — shareable; mirrors #apply)
├── /partners         (Discreet "Partner with us" inquiry)
├── /thank-you        (Confirmation state)
├── /waitlist         (Seats-nearly-full / waitlist state)
├── /privacy          (Privacy Policy — DPDP Act 2023)
├── /terms            (Terms & Conditions)
├── /refunds          (Refund & Cancellation policy)
├── /cookies          (Cookie policy)
├── /sitemap.xml
├── /robots.txt
└── /llms.txt         (AEO: plain-text event facts for LLMs)
```

Global on every page: sticky header nav, footer, cookie-consent banner.

## 2. Navigation

**Header (sticky):**
- Left: **THE PEDIMENT** wordmark → `#hero`.
- Center (desktop) / hamburger (mobile): The Pediment · The Prologue · Pillars · Experience · FAQ (smooth-scroll anchors).
- Right: primary CTA **"Request Invitation"** → `#apply`.
- Utility: discreet **"Partner with us"** → `/partners`.

**Behavior:** smooth scroll; active-section highlight; nav condenses on scroll; sticky CTA on mobile.

**Footer:** wordmark + one-line positioning · nav repeat · legal links (Privacy · Terms · Refunds · Cookies) · **hello@thepediment.com** · social icons (LinkedIn · Instagram · X — placeholder links) · independence statement · © line.

## 3. Page / section architecture (Home)

| Order | Section | ID | Job | Key components |
|---|---|---|---|---|
| 1 | Hero | `#hero` | Frame the event, drive to apply | Title, subtitle, date + location, CTA, scarcity cue |
| 2 | What is The Pediment | `#about` | Umbrella brand + invitation-first frame | Positioning + 3 proof points |
| 3 | The Prologue vision | `#prologue` | The pre-departure convergence | Narrative block |
| 4 | Five themes | `#pillars` | Intellectual substance | 5 theme cards + Climate note |
| 5 | The Experience | `#experience` | What a delegate gets | Curated room, access, production, conditional grants |
| 6 | Tiers | `#tiers` | Route VIP vs Observer | Two cards; Observer shows Inaugural Early Access; VIP = application |
| 7 | Speakers & Partners | `#speakers` | Credibility | Confirmed logos/names OR holding state |
| 8 | FAQ | `#faq` | Remove objections + AEO | Accordion, canonical Q&A |
| 9 | Apply | `#apply` | Convert | Application form (tier branching) |
| — | Footer | — | Legal + trust | Links, contact, disclaimers |

## 4. Backend — Supabase (Postgres)

Connect a Supabase project to Emergent. Store the frontend with code in a **private GitHub repo** (GitHub is connected to Emergent). Two tables + a derived view.

### 4.1 Table `applications`
| Column | Type | Req | Notes |
|---|---|---|---|
| id | uuid (pk, default gen) | auto | |
| created_at | timestamptz (default now) | auto | |
| full_name | text | ✓ | |
| email | text | ✓ | valid email |
| phone | text | ✓ | E.164; WhatsApp channel |
| linkedin_url | text | ✓ | must contain `linkedin.com/` |
| instagram_handle | text | ✓ | strip leading `@`; feeds UGC tagging/onboarding (§9 of manual) |
| affiliation | text | ✓ | university / company |
| domain_sector | text | ✓ | Governance / Leadership / Tech / AI / Healthcare / Finance-VC / Other |
| city | text | ✓ | |
| tier | text (enum-checked) | ✓ | `vip_delegate` \| `premium_observer` |
| delegate_status | text | cond | VIP branch: `accepted` \| `applied` |
| media_waiver_consent | bool | ✓ | must be true |
| privacy_consent | bool | ✓ | must be true |
| payment_status | text | default `pending` | `pending`/`link_sent`/`paid` (internal, team-set) |
| source | text | auto | UTM / referrer |

### 4.2 Table `partner_inquiries`
| Column | Type | Req |
|---|---|---|
| id, created_at | auto | |
| name, organization, work_email, role | text | ✓ |
| interest | text | ✓ (`talent_pod`/`title`/`fnb`/`media`/`other`) |
| message | text | – |
| privacy_consent | bool | ✓ |

### 4.3 Derived view `delegate_dossier`
Read-only view over `applications`: full_name, linkedin_url, domain_sector, affiliation, city. **Aggregated/anonymized** for any pre-agreement partner summary; full detail shared only after a signed agreement. Not public.

### 4.4 Security
- Row-level security ON. Frontend uses an `anon` key restricted to **INSERT only** on `applications` and `partner_inquiries` (no read).
- Reads/exports happen through the team's Supabase dashboard or the `service_role` key server-side — never exposed to the browser.
- Store keys as Emergent environment variables, not in the repo.

## 5. Form schema & validation

**Application form** — single form, tier toggle branches fields.
1. Tier (VIP Delegate / Premium Observer) — required, drives branching.
2. Full name — required, 2+ words.
3. Email — required, valid.
4. Phone (WhatsApp) — required, valid intl.
5. LinkedIn URL — required, contains `linkedin.com/`.
5b. Instagram handle — required (UGC flywheel — delegates are required to post; needed to tag/onboard them).
6. University / Affiliation — required.
7. Domain / Sector — required (select + Other).
8. City — required.
9. *(VIP only)* Delegate status — required in VIP branch.
10. ☑ Media waiver — required to submit.
11. ☑ Privacy consent — required to submit (links `/privacy`).
12. Submit → insert to Supabase → `/thank-you` + confirmation email.

**Validation:** inline, on blur; submit disabled until both consents checked; honeypot field for spam.

**Partner form** (`/partners`): name, organization, work email, role, interest (select), message, privacy consent.

## 6. States

| State | Trigger | Behavior |
|---|---|---|
| Default | Seats available | Form open; scarcity cue shown |
| Submitting | Valid submit | Button loading; block double-submit |
| Success | Insert ok | Redirect `/thank-you`; fire conversion event; send email |
| Error | Insert/network fail | Preserve input; show retry |
| Waitlist | VIP capacity reached | Form → waitlist mode (`/waitlist`); still captures data |
| Cookie pre-consent | First visit | Banner; analytics gated until accept |

## 7. User flows

**A. VIP Delegate:** arrive → read → Request Invitation → tier=VIP (+ delegate status) → consents → submit → `/thank-you` ("we'll confirm on WhatsApp") → team confirms + private onboarding → WhatsApp network.

**B. Premium Observer:** arrive → read → Request Invitation → tier=Observer → consents → submit → `/thank-you` → team sends **Inaugural Early Access (₹5,000)** payment link → paid → onboarding.

**C. Partner:** footer/nav "Partner with us" → `/partners` → inquiry → team inbox → offline follow-up. No pricing on site.

**D. Waitlist:** capacity reached → apply → `/waitlist` → data still captured → notified if a seat opens.

## 8. Integrations

| Concern | Approach |
|---|---|
| Data store | **Supabase** (Postgres), INSERT-only from client |
| Confirmation email | Transactional email (Emergent/SMTP/Resend-class), auto on submit |
| Payment | Manual link now; gateway (Razorpay/UPI) fast-follow |
| Messaging | WhatsApp (manual/broadcast) — off-site |
| Analytics | Lightweight (GA4/Plausible-class); events per FR-11 |
| Source control | Private GitHub repo, connected to Emergent |
| Anti-spam | Honeypot + rate limit |

## 9. Technical / non-functional

- **Rendering:** server-rendered or statically generated so content is crawlable and LLM-readable without JS (supports AEO — §11).
- **Responsive:** mobile-first (warm traffic arrives on mobile via WhatsApp).
- **Performance:** optimize hero media; lazy-load below fold; strong LCP.
- **Accessibility:** semantic structure, labelled inputs, contrast, keyboard-navigable form + FAQ accordion.
- **Reliability:** confirm-before-clear; error retry; never drop a submission.

## 10. SEO / metadata

- `<title>`: *The Leadership Prologue 2026 — The Pediment*.
- Meta description: premium one-liner (see `03`).
- OG/Twitter card: editorial preview image + title + date/location.
- Canonical URLs; `sitemap.xml`; `robots.txt` (allow reputable crawlers).
- Descriptive, stable URLs.

## 11. AEO architecture (answer-engine optimization)

- **JSON-LD** in `<head>`:
  - `Organization` — The Pediment (name, url, logo, sameAs → socials).
  - `Event` — The Leadership Prologue 2026; `startDate` 2026-08-05; `location` Bangalore, IN; `organizer` The Pediment; `eventAttendanceMode` offline; `offers` → Inaugural Early Access, price 5000 INR, priceCurrency INR, availability.
  - `FAQPage` — mirrors the on-page FAQ.
- **`llms.txt`** at root: plain-text canonical facts (what it is, date, city, who attends, how to apply, pricing, independence statement, contact).
- **Semantic HTML:** one `<h1>`, ordered headings, `<main>`/`<section>`/`<nav>`/`<footer>`.
- **Self-contained answers:** FAQ answers make sense out of context (LLMs quote them directly).
- **Crawlability:** SSR/SSG content, sitemap, permissive robots.
- **Consistency:** identical event facts across page copy, JSON-LD, and `llms.txt` — no contradictions.

## 12. Compliance architecture

- Both consents captured at source and stored per row with timestamp.
- Legal routes linked in footer + inline at forms.
- Cookie banner gates analytics scripts until accept.
- Content guardrails enforced (see `03` honesty checklist): independence framing only; grants conditional; confirmed-only speakers; no VIP fee shown publicly.
- Partner data sharing: aggregated pre-agreement, full post-agreement — reflected in Privacy Policy.
