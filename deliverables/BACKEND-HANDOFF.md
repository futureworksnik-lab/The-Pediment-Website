# The Pediment — Backend Handoff

Everything Emergent's frontend needs to wire against, plus what Nick needs to do before
this goes live.

**Status: deployed and verified against the live Supabase project (`kxxoapufmqzgchcaqyqe`)
on 2026-07-04.** Schema, RLS, and the `apply` function are live. The checklist below has
been run end-to-end against the deployed function — all test data was cleaned up
afterward (`applications`/`partner_inquiries` are empty, ready for real submissions).
Email sending was **not** exercised (no `ZEPTOMAIL_TOKEN` yet — see "What Nick needs to
do" below); everything else is confirmed working.

## What Emergent gets

- **Edge Function URL:** `https://kxxoapufmqzgchcaqyqe.supabase.co/functions/v1/apply`
- **Request/response contract:** see `supabase/functions/apply/index.ts` header comment,
  or the summary below.
- **Plausible snippet + `trackEvent` contract:** `deliverables/plausible.html`.
- No Supabase key of any kind goes to the frontend — it only ever calls the URL above.

### Request contract

```jsonc
// application form
POST /functions/v1/apply
{
  "form": "application",
  "nickname": "",                          // honeypot — must stay empty
  "tier": "vip" | "obs",
  "full_name": "...", "email": "...", "phone": "...",
  "linkedin_url": "...", "instagram_handle": "...",
  "affiliation": "...", "domain_sector": "Governance|Leadership|Tech|AI|Healthcare|Finance / VC|Other",
  "city": "...",
  "delegate_status": "Accepted" | "Applied", // required only when tier === "vip"
  "media_waiver_consent": true, "privacy_consent": true,
  "source": "..."                            // optional, UTM/referrer
}

// partner inquiry
POST /functions/v1/apply
{
  "form": "partner_inquiry",
  "nickname": "",
  "name": "...", "organization": "...", "work_email": "...", "role": "...",
  "interest": "talent_pod" | "title" | "fnb" | "media" | "other",
  "message": "...",                          // optional
  "privacy_consent": true
}
```

### Response contract

```jsonc
{ "ok": true, "redirect": "/thank-you" }
{ "ok": true, "redirect": "/waitlist" }   // capacity reached for that tier — row still inserted
{ "ok": false, "error": "human-readable message" }
```

## What Nick needs to do

1. **ZeptoMail** — sign up, verify `thepediment.com`, generate a send-mail token,
   add it as the `ZEPTOMAIL_TOKEN` Edge Function secret. Add the SPF/DKIM/DMARC DNS
   records ZeptoMail provides at verification time — without these, confirmation
   emails will land in spam regardless of code correctness.
2. **Zoho Mail** — set up the `hello@thepediment.com` mailbox (for receiving replies
   and manual sends) if not already live.
3. **Plausible** — register `thepediment.com` as a site (or confirm self-host), share
   `deliverables/plausible.html` with Emergent.
4. **Confirm seat caps** — currently `VIP_SEAT_CAP=100`, `OBSERVER_SEAT_CAP=50`
   (per modules/07-delegate-supply-and-ticketing.md's 286-pool → ~100 VIP seats math).
   Change via Edge Function secrets if the real numbers differ.
5. **CORS** — set `ALLOWED_ORIGINS` to the production domain(s) once known
   (e.g. `https://thepediment.com,https://www.thepediment.com`), plus any Emergent
   preview origin needed during development.

## Environment variables (Supabase → Edge Functions → Secrets)

| Var | Example | Notes |
|---|---|---|
| `SUPABASE_URL` | auto-injected | |
| `SUPABASE_SERVICE_ROLE_KEY` | auto-injected | bypasses RLS — never expose to a browser |
| `ZEPTOMAIL_TOKEN` | `Zoho-enczapikey ...` | from ZeptoMail dashboard |
| `VIP_SEAT_CAP` | `100` | |
| `OBSERVER_SEAT_CAP` | `50` | |
| `ALLOWED_ORIGINS` | `https://thepediment.com` | comma-separated |

## Deploy steps (via Supabase MCP, from this repo) — already run once, for reference

```
1. mcp__supabase__apply_migration  → supabase/migrations/0001_init.sql
2. mcp__supabase__get_advisors (type: security)  → confirm zero findings
3. Set secrets (Supabase dashboard → Edge Functions → apply → Secrets, or `supabase secrets set`)
4. mcp__supabase__deploy_edge_function → supabase/functions/apply/{index.ts,deno.json}
```

## Verification checklist — result of the 2026-07-04 run

All run against the live deployed function; rows inspected via MCP `execute_sql`
(service-role reads bypass RLS by design). Capacity tests used bulk SQL inserts to
reach the real caps (100 / 50) rather than temporarily lowering the env var, since no
secrets-editing tool was available in this session — same effect, no code path skipped.
All synthetic rows were deleted afterward; both tables are empty and ready for real use.

- [x] Valid VIP application → row in `applications`, `tier='vip_delegate'`,
      `delegate_status='Applied'`, both consents `true`. *(Email send not exercised — no `ZEPTOMAIL_TOKEN` set yet; function logs and continues rather than failing, confirmed in code.)*
- [x] Valid Observer application → row has `tier='premium_observer'`, `delegate_status` null.
- [x] Honeypot (`nickname` filled) → `200 {"ok":true,"redirect":"/thank-you"}`, **no row inserted**.
- [x] Same email 4× within 10 minutes → 4th request → **`429`**, confirmed via `-w "%{http_code}"`.
- [x] `media_waiver_consent: false` → `400`, **no row inserted**.
- [x] Reached `VIP_SEAT_CAP=100` and `OBSERVER_SEAT_CAP=50` via bulk insert → next submission
      of each tier still inserted (confirmed via `execute_sql`) and returned
      `redirect:"/waitlist"`.
- [x] Valid partner inquiry → row in `partner_inquiries`, `interest='title'`.
- [x] anon isolation — tested against the real anon key:
      `GET /rest/v1/applications` → `200 []` (RLS filters all rows, none leaked);
      `POST /rest/v1/applications` → `401`, `42501` RLS violation;
      `POST /rest/v1/partner_inquiries` → `401`, `42501` RLS violation;
      `GET /rest/v1/delegate_dossier` → `401` permission denied (grant revoked entirely —
      stronger than RLS-filtering, matches the `security_invoker` + `revoke` migration step).
- [x] `mcp__supabase__get_advisors` (security) → **2 expected INFO findings** ("RLS enabled,
      no policy" on both tables — by design, all writes go through the function) **+ 2 WARN
      findings on `public.rls_auto_enable()`** — a pre-existing, platform-owned event-trigger
      function (owner `postgres`, not created by this migration) that auto-enables RLS on new
      tables. It's flagged as anon/authenticated-callable via RPC, but functions declared
      `RETURNS event_trigger` cannot actually be invoked outside a trigger context — not
      exploitable, no action taken.

### Example curl (fill in the deployed URL + anon key as needed)

```bash
FN_URL="https://kxxoapufmqzgchcaqyqe.supabase.co/functions/v1/apply"

# Valid VIP application
curl -s -X POST "$FN_URL" -H "Content-Type: application/json" -d '{
  "form":"application","nickname":"",
  "tier":"vip","full_name":"Asha Rao","email":"asha.test@example.com",
  "phone":"+919812345678","linkedin_url":"https://linkedin.com/in/asharao",
  "instagram_handle":"asharao","affiliation":"IIT Bombay","domain_sector":"AI",
  "city":"Bengaluru","delegate_status":"Applied",
  "media_waiver_consent":true,"privacy_consent":true
}'

# Honeypot triggered
curl -s -X POST "$FN_URL" -H "Content-Type: application/json" -d '{
  "form":"application","nickname":"bot-filled-this",
  "tier":"vip","full_name":"Bot","email":"bot@example.com","phone":"+910000000000",
  "linkedin_url":"https://linkedin.com/in/bot","instagram_handle":"bot",
  "affiliation":"x","domain_sector":"Other","city":"x","delegate_status":"Applied",
  "media_waiver_consent":true,"privacy_consent":true
}'
```
