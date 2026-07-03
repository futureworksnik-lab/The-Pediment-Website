# The Pediment — Website Build Spec (Single Source of Truth)

> **The Leadership Prologue 2026** · v2.0 · Product, content & architecture foundation.
> Written to be pasted into Emergent as complete build guidance. Approve before visual design / UI begins.

| # | Document | Purpose |
|---|---|---|
| 01 | [PRD](01-PRD.md) | Objectives, users/roles, scope, functional requirements, payment model, compliance, AEO, platform |
| 02 | [System & Information Architecture](02-system-and-information-architecture.md) | Sitemap, page/section map, Supabase schema, form schema, states, flows, AEO/SEO + compliance architecture |
| 03 | [Website Content & IA](03-website-content-and-ia.md) | Final copy for every page/section, nav, CTAs, FAQ, form microcopy, legal copy, `llms.txt`, honesty + AEO checklist |

## Event facts (canonical — keep identical everywhere)
The Leadership Prologue 2026 · organiser **The Pediment** · **5 August 2026** · **Bangalore, India** · invitation-first single-evening summit · themes: Global Governance, Leadership, Technology, AI, Healthcare (closing note on Climate).

## Locked decisions
1. **Scope:** premium single long-scroll landing + legal/utility pages. No accounts/login.
2. **Sponsor path:** delegate-only site + discreet "Partner with us" inquiry; partners close offline. No public pricing.
3. **Payment:** form-first (gateway is a fast-follow). Only the Observer price is public: **Inaugural Early Access — ₹5,000, non-refundable, rate rises once the limited allocation closes.** No VIP fee shown publicly.
4. **Backend:** **Supabase** (Postgres), INSERT-only from client; code in a **private GitHub repo** connected to Emergent.
5. **AEO:** JSON-LD (Organization, Event, FAQPage), `llms.txt`, semantic HTML, SSR/SSG, self-contained FAQ.
6. **Independence:** no external-conference name until written approval; independent framing everywhere.

## Non-negotiable content rules
No affiliation/endorsement claims · travel grants "up to 5, from surplus, conditional" · confirmed speakers only · no VIP fee public · media waiver + privacy consent mandatory on every submission · event facts identical across copy, JSON-LD, and `llms.txt`.

## Confirm before publish
Live hello@thepediment.com mailbox · venue (kept private) · social handles (LinkedIn / Instagram / X — placeholders now) · Supabase project + keys in Emergent · private GitHub repo created · event-postponement clause in Refunds.

## Next phase (after approval)
Visual design & UI/UX — only once this foundation is approved.
