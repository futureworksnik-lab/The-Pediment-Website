-- The Pediment — Supabase schema
-- Source: 02-system-and-information-architecture.md §4, reconciled against the
-- actually-shipped form code in The-Pediment-Website repo (exact enum strings
-- below are the LIVE values, not the doc's — see discrepancies noted inline).
--
-- Security model: RLS ON, zero policies for anon/authenticated roles on either
-- table. All writes happen through the Edge Function using the service_role
-- key (which bypasses RLS by design). This is a deliberate deviation from
-- 02 §4.4's "anon key restricted to INSERT only" — that model still leaves the
-- table directly reachable from the browser. Routing every write through the
-- Edge Function means the tables have zero public attack surface.

create extension if not exists "pgcrypto";

create table applications (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  full_name             text not null,
  email                 text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone                 text not null,
  linkedin_url          text not null check (linkedin_url ilike '%linkedin.com/%'),
  instagram_handle      text not null,
  affiliation           text not null,
  domain_sector         text not null check (domain_sector in (
                          'Governance','Leadership','Tech','AI','Healthcare','Finance / VC','Other'
                        )), -- live dropdown value is "Finance / VC" (slash+spaces) — NOT "Finance-VC"
  city                  text not null,
  tier                  text not null check (tier in ('vip_delegate','premium_observer')),
                        -- client internal state uses 'vip'/'obs' — Edge Function must map:
                        -- 'vip' -> 'vip_delegate', 'obs' -> 'premium_observer'
  delegate_status       text check (delegate_status in ('Accepted','Applied')),
                        -- live option values are capitalized "Accepted"/"Applied" —
                        -- 02 §4.1 documents lowercase, that's stale; use the live values
  media_waiver_consent  boolean not null check (media_waiver_consent = true),
  privacy_consent       boolean not null check (privacy_consent = true),
  payment_status        text not null default 'pending' check (payment_status in ('pending','link_sent','paid')),
  source                text -- UTM/referrer, captured by the Edge Function from request metadata
);

-- delegate_status required only when tier = vip_delegate — enforce in the
-- Edge Function (simpler than a conditional CHECK across two columns), since
-- the function already branches on tier for the capacity check.

create table partner_inquiries (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  name             text not null,
  organization     text not null,
  work_email       text not null check (work_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role             text not null,
  interest         text not null check (interest in ('talent_pod','title','fnb','media','other')),
  message          text,
  privacy_consent  boolean not null check (privacy_consent = true)
);

alter table applications enable row level security;
alter table partner_inquiries enable row level security;
-- No policies added deliberately — service_role bypasses RLS; anon/authenticated
-- have zero access to either table directly.

-- Read-only aggregated view for pre-agreement partner sharing (02 §4.3).
-- Not exposed to anon/public; accessed via dashboard or service_role only.
create view delegate_dossier as
  select full_name, linkedin_url, domain_sector, affiliation, city
  from applications;

-- security_invoker: without this, the view runs as its owner (postgres) and
-- bypasses applications' RLS entirely — a plain `create view` here would be
-- readable through PostgREST regardless of the base table's RLS policies.
-- With it on, the view enforces the querying role's own RLS, same as if they
-- queried applications directly (i.e. still nothing for anon/authenticated).
alter view delegate_dossier set (security_invoker = on);
revoke all on delegate_dossier from anon, authenticated;

-- Rate-limit lookups in the Edge Function filter by email within a time
-- window; index makes that cheap.
create index idx_applications_email on applications (email);

-- Suggested index to make the VIP-capacity count in the Edge Function cheap:
create index idx_applications_tier on applications (tier);
