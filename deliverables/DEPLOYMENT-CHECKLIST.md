# The Pediment — Deployment Checklist (from zero to live MVP)

Written for a first-time launcher. Each item says **what it is**, **why it's needed**,
and **exactly what to do**. Items marked 🧑 need YOU (accounts/credentials only you
can create). Items marked 🤖 are done by Claude Code once you provide access.

**Current state (verified 4 July 2026):**
- ✅ Backend (database + `apply` API) deployed and live on Supabase
- ✅ Frontend complete on branch `feat/mvp-frontend` (all 9 pages, form wired, analytics, SEO)
- ✅ Domain thepediment.com registered (Cloudflare)
- ❌ Not yet: hosting, DNS records, email sending, analytics account, CORS allowlist

---

## Phase 1 — Put the site on the internet (Vercel)

### 1. 🧑 Create a Vercel account
- **What:** Vercel is the hosting service that serves the website files globally. Free tier is enough.
- **Why:** the site needs a server; Vercel is zero-maintenance for static sites.
- **How:** go to vercel.com → "Sign Up" → **Continue with GitHub** (use the account that owns `futureworksnik-lab/The-Pediment-Website`).

### 2. 🧑 Import the repo into Vercel (5 clicks, I'll guide live if needed)
- Vercel dashboard → **Add New → Project** → pick `The-Pediment-Website`.
- Framework preset: **Other**. Build command: leave EMPTY. Output directory: `frontend/public`.
  (The repo's `vercel.json` already encodes this + security headers.)
- Click **Deploy**. You'll get a `*.vercel.app` preview URL — the site is now live on a temporary address.

### 3. 🧑 Add the custom domain
- **What/why:** connects thepediment.com to Vercel.
- **How:** Vercel → Project → **Settings → Domains** → add `thepediment.com` and `www.thepediment.com`. Vercel shows you 1–2 DNS records (an A record and a CNAME).

### 4. 🧑 Add those DNS records in Cloudflare
- **What:** DNS records tell the internet where thepediment.com lives.
- **How:** dash.cloudflare.com → thepediment.com → **DNS → Records** → add exactly what Vercel showed (A `76.76.21.21` for the root, CNAME `cname.vercel-dns.com` for www — confirm against Vercel's screen). Set the cloud icon to **DNS only (grey)**, not proxied.
- Within ~10 minutes https://thepediment.com serves the site with HTTPS automatic.

## Phase 2 — Make the backend production-ready

### 5. 🤖 Set `ALLOWED_ORIGINS` on the Edge Function
- **What/why:** the API only answers browsers from approved website addresses (CORS). Right now no production domain is approved.
- **How:** Supabase dashboard → project `kxxoapufmqzgchcaqyqe` → **Edge Functions → Secrets** → set `ALLOWED_ORIGINS` to `https://thepediment.com,https://www.thepediment.com` (plus the `*.vercel.app` preview URL if you want test submissions from previews). I can do this if the Supabase MCP connection is active in my session — otherwise it's a 1-minute dashboard edit I'll walk you through.

### 6. 🧑 Confirm the seat caps
- **What/why:** at 100 VIP / 50 Observer applications, later applicants land on the waitlist page (their application is still saved). These are placeholder numbers from the planning docs.
- **How:** just tell me the real numbers (or "keep 100/50") — set as `VIP_SEAT_CAP` / `OBSERVER_SEAT_CAP` secrets next to `ALLOWED_ORIGINS`.

## Phase 3 — Email (applicants currently get NO confirmation email)

### 7. 🧑 Create a ZeptoMail account + token
- **What:** ZeptoMail (by Zoho) sends the automatic confirmation emails. Pay-as-you-go, ~free at our volume.
- **Why:** without it, applications save fine but applicants hear nothing.
- **How:** zeptomail.zoho.com → sign up → **Add a Mail Agent** → add domain `thepediment.com`. It gives you (a) DNS records to prove you own the domain, and (b) a **Send Mail Token** — copy that token and give it to me privately (or paste it yourself into Supabase secrets as `ZEPTOMAIL_TOKEN`).

### 8. 🧑 Add ZeptoMail's DNS records in Cloudflare
- **What/why:** SPF + DKIM records prove the emails are really from you; without them everything lands in spam.
- **How:** copy each TXT/CNAME record ZeptoMail shows into Cloudflare DNS (same screen as step 4). Then click "Verify" in ZeptoMail.

### 9. 🧑 Create the hello@thepediment.com mailbox
- **What:** an actual inbox for replies (ZeptoMail only sends, it can't receive).
- **How:** Zoho Mail free plan (mail.zoho.com) → add domain thepediment.com → create user `hello` → add the MX records it gives you to Cloudflare. (Google Workspace works too, ~₹160/user/month.)

## Phase 4 — Analytics

### 10. 🧑 Create a Plausible account
- **What:** privacy-friendly visitor analytics (which pages people read, how many apply). ~$9/month, 30-day free trial.
- **Why:** the site already fires 6 events (views, scroll depth, application submits) — they just need an account to land in.
- **How:** plausible.io → sign up → **Add website** → domain `thepediment.com`. That's it — the site's code already matches. (Free alternative: skip for now; the site works fine without it.)

## Phase 5 — Verify everything end-to-end (🤖 I run this, you watch)

1. Submit a real test application (VIP + Observer) on the live site → confirm redirect to /thank-you, row in Supabase, confirmation email arrives.
2. Temporarily set `OBSERVER_SEAT_CAP=1` → second Observer submit → /waitlist page, row still saved → restore cap.
3. Partner inquiry test → /partners form → acknowledgement email.
4. Check Plausible dashboard shows the events.
5. Compliance grep + link check on the deployed HTML (already passing locally).
6. Google Rich Results test on the homepage (Event + FAQ structured data).

## Phase 6 — Before announcing (content, not code)

- 🧑 Lawyer/CA review of /privacy, /terms, /refunds (currently well-structured drafts).
- 🧑 Social handles (LinkedIn/Instagram/X) — footer links are placeholders until then.
- 🧑 Final read-through of all copy on the live site.

---

## What I still need from you (summary)

| # | Item | Where | Effort |
|---|---|---|---|
| 1 | Vercel account + import repo + add domain | vercel.com | ~10 min |
| 2 | 2 DNS records in Cloudflare (site) | dash.cloudflare.com | ~5 min |
| 3 | ZeptoMail account + token → me (or Supabase secrets) | zeptomail.zoho.com | ~15 min |
| 4 | ZeptoMail DNS records in Cloudflare | dash.cloudflare.com | ~5 min |
| 5 | Zoho Mail mailbox for hello@ + MX records | mail.zoho.com | ~15 min |
| 6 | Plausible account | plausible.io | ~5 min |
| 7 | Seat-cap numbers (or "keep 100/50") | tell me | 1 min |
| 8 | Supabase dashboard access working in my session (MCP) for secrets — or you paste 4 secrets yourself | supabase.com | ~5 min |

Everything else — code, config, testing, monitoring setup — is my job.
