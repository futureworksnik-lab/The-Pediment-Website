# CLAUDE.md — The Pediment Backend

## Scope

This repo's Claude Code work is **backend only**: Supabase schema, one Edge Function
(`apply`), and a Plausible analytics contract for `thepediment.com` (The Leadership
Prologue 2026, by The Pediment).

**Never touch the frontend.** The approved static HTML/CSS/JS bundle in `handoff/` is a
locked design export; the live frontend is built and wired by a separate Emergent track in
`https://github.com/futureworksnik-lab/The-Pediment-Website`. Do not edit, regenerate, or
"improve" it from here — this repo only produces the API it calls.

## Source-of-truth docs

- [website/02-system-and-information-architecture.md](website/02-system-and-information-architecture.md) §4 — Supabase data model (schema, RLS, form fields, states, flows)
- [website/03-website-content-and-ia.md](website/03-website-content-and-ia.md) §14 — confirmation email copy (VIP / Observer / partner), §8–13 — FAQ/legal/page copy
- [modules/07-delegate-supply-and-ticketing.md](modules/07-delegate-supply-and-ticketing.md) — seat caps and supply/demand model
- [website/06-handoff.md](website/06-handoff.md) — full project handoff, locked decisions, Emergent kickoff prompt

## Supabase project

- Project ref: `kxxoapufmqzgchcaqyqe` (`https://kxxoapufmqzgchcaqyqe.supabase.co`)
- MCP server is project-scoped (added via `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=kxxoapufmqzgchcaqyqe"`); tools take no `project_id` param.
- Deploy schema changes: `mcp__supabase__apply_migration` using files in `supabase/migrations/`.
- Deploy the function: `mcp__supabase__deploy_edge_function` using files in `supabase/functions/apply/`.
- After any DDL change, run `mcp__supabase__get_advisors` (type `security`) — zero findings expected.

## Environment variables (Edge Function secrets — never commit these)

| Var | Purpose |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | auto-injected by Supabase; used to bypass RLS from the function |
| `ZEPTOMAIL_TOKEN` | Zoho ZeptoMail transactional API token — sends confirmation emails from `hello@thepediment.com` |
| `VIP_SEAT_CAP` | integer, default `100` — VIP applications at/over this count still insert but redirect to `/waitlist` |
| `OBSERVER_SEAT_CAP` | integer, default `50` — same logic for Premium Observer |
| `ALLOWED_ORIGINS` | comma-separated list of allowed CORS origins for the function |

No Supabase **anon key** is used anywhere in this design — the frontend calls only the
Edge Function's public URL. Do not generate or hand out an anon key unless a future
feature needs direct client reads.

## Non-negotiable content/compliance rules

These apply to any machine-generated text this backend produces (error messages, email
copy, logs) — see [website/03-website-content-and-ia.md](website/03-website-content-and-ia.md) §15 for the full checklist:

- Never name **HPAIR** or **Hanoi**, or any external conference, anywhere participant-facing. Use "the international delegate programme" if a generic reference is needed.
- Never use "young" or "youth" — use "emerging."
- Never show a VIP Delegate price anywhere public. Only the Premium Observer "Inaugural Early Access — ₹5,000, non-refundable" price is ever shown.
- Travel grants are always "up to five, funded from partner surplus, conditional — not guaranteed."
- `delegate_status` stays generic (`Accepted`/`Applied`) — never expanded or renamed to reference a source programme.
- Every application row must carry both `media_waiver_consent` and `privacy_consent` as `true` — never allow an insert that bypasses either.

## Verification

Full curl test suite, deploy steps, and DNS requirements: [deliverables/BACKEND-HANDOFF.md](deliverables/BACKEND-HANDOFF.md).
