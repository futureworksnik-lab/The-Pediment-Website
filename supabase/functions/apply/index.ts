// The Pediment — `apply` Edge Function
// Handles both the application form and the partner-inquiry form, distinguished
// by the `form` field. See CLAUDE.md and website/02-...md §4 / 03-...md §14 for
// the schema and copy this implements.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ZEPTOMAIL_TOKEN = Deno.env.get("ZEPTOMAIL_TOKEN") ?? "";
const VIP_SEAT_CAP = Number(Deno.env.get("VIP_SEAT_CAP") ?? "100");
const OBSERVER_SEAT_CAP = Number(Deno.env.get("OBSERVER_SEAT_CAP") ?? "50");
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const FROM_ADDRESS = "hello@thepediment.com";
const FROM_NAME = "The Pediment";

const DOMAIN_SECTORS = [
  "Governance",
  "Leadership",
  "Tech",
  "AI",
  "Healthcare",
  "Finance / VC",
  "Other",
];
const PARTNER_INTERESTS = ["talent_pod", "title", "fnb", "media", "other"];
const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX = 3;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function corsHeaders(origin: string | null) {
  const allowOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function firstName(fullName: string): string {
  return (fullName ?? "").trim().split(/\s+/)[0] || "there";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
}

// --- Email copy, verbatim from website/03-website-content-and-ia.md §14 ---

function vipEmail(name: string) {
  return {
    subject: "Your application to The Leadership Prologue 2026",
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for applying to The Leadership Prologue 2026 — an invitation-first evening for the leaders representing India on the world stage, in Bangalore on 5 August.</p>
      <p>Every application is read personally. If your place is confirmed, we'll reach you on WhatsApp with your next steps and your welcome into the delegate network.</p>
      <p>The room fills by selection. We're glad you're in it.</p>
      <p>— The Pediment<br/>hello@thepediment.com</p>
    `,
  };
}

function observerEmail(name: string) {
  return {
    subject: "Your application to The Leadership Prologue 2026",
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for applying to The Leadership Prologue 2026 — an invitation-first evening convening India's most vetted emerging leaders, in Bangalore on 5 August.</p>
      <p>Every application is read personally. If your place is confirmed, we'll follow up shortly with your reservation details and a secure link to complete your Inaugural Early Access seat (₹5,000).</p>
      <p>Seats are limited and curated. We'll be in touch soon.</p>
      <p>— The Pediment<br/>hello@thepediment.com</p>
    `,
  };
}

function partnerEmail(name: string) {
  return {
    subject: "Thank you for your interest in The Leadership Prologue 2026",
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for your interest in partnering with The Leadership Prologue 2026. Our team will be in touch shortly with the partnership brief and to understand how we can work together.</p>
      <p>— The Pediment<br/>hello@thepediment.com</p>
    `,
  };
}

async function sendEmail(to: string, name: string, subject: string, html: string) {
  if (!ZEPTOMAIL_TOKEN) {
    console.error("ZEPTOMAIL_TOKEN not set — skipping email send");
    return;
  }
  try {
    const res = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        Authorization: `Zoho-enczapikey ${ZEPTOMAIL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { address: FROM_ADDRESS, name: FROM_NAME },
        to: [{ email_address: { address: to, name } }],
        subject,
        htmlbody: html,
      }),
    });
    if (!res.ok) {
      console.error("ZeptoMail send failed", res.status, await res.text());
    }
  } catch (err) {
    // Email failure never fails the request — the row is already saved.
    console.error("ZeptoMail send threw", err);
  }
}

async function isRateLimited(table: "applications" | "partner_inquiries", emailColumn: string, email: string) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq(emailColumn, email)
    .gte("created_at", since);
  if (error) {
    console.error("rate limit check failed", error);
    return false;
  }
  return (count ?? 0) >= RATE_LIMIT_MAX;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405, headers);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400, headers);
  }

  // Honeypot — applies to both forms. Don't tip off bots: respond 200 with no insert.
  if (isNonEmptyString(body.nickname)) {
    return json({ ok: true, redirect: "/thank-you" }, 200, headers);
  }

  const form = body.form;

  if (form === "application") {
    return handleApplication(body, headers);
  }
  if (form === "partner_inquiry") {
    return handlePartnerInquiry(body, headers);
  }
  return json({ ok: false, error: "Unknown form type" }, 400, headers);
});

async function handleApplication(body: Record<string, unknown>, headers: Record<string, string>) {
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 400, headers);
  }

  if (await isRateLimited("applications", "email", email)) {
    return json(
      { ok: false, error: "Too many submissions. Please try again in a few minutes." },
      429,
      headers,
    );
  }

  const rawTier = body.tier;
  const tier = rawTier === "vip" ? "vip_delegate" : rawTier === "obs" ? "premium_observer" : null;
  if (!tier) {
    return json({ ok: false, error: "Please select a valid tier." }, 400, headers);
  }

  const fullName = body.full_name;
  const phone = body.phone;
  const linkedinUrl = body.linkedin_url;
  const instagramHandle = body.instagram_handle;
  const affiliation = body.affiliation;
  const domainSector = body.domain_sector;
  const city = body.city;

  if (
    !isNonEmptyString(fullName) ||
    !isNonEmptyString(phone) ||
    !isNonEmptyString(linkedinUrl) ||
    typeof linkedinUrl === "string" && !linkedinUrl.toLowerCase().includes("linkedin.com/") ||
    !isNonEmptyString(instagramHandle) ||
    !isNonEmptyString(affiliation) ||
    !isNonEmptyString(city) ||
    !isNonEmptyString(domainSector) ||
    !DOMAIN_SECTORS.includes(domainSector as string)
  ) {
    return json({ ok: false, error: "Please complete all required fields." }, 400, headers);
  }

  let delegateStatus: string | null = null;
  if (tier === "vip_delegate") {
    if (body.delegate_status !== "Accepted" && body.delegate_status !== "Applied") {
      return json(
        { ok: false, error: "Please select your delegate status." },
        400,
        headers,
      );
    }
    delegateStatus = body.delegate_status;
  }

  if (body.media_waiver_consent !== true || body.privacy_consent !== true) {
    return json(
      { ok: false, error: "Please accept the media waiver and privacy terms to continue." },
      400,
      headers,
    );
  }

  const source = isNonEmptyString(body.source) ? body.source : null;

  const cap = tier === "vip_delegate" ? VIP_SEAT_CAP : OBSERVER_SEAT_CAP;
  const { count: tierCount, error: countError } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("tier", tier);
  if (countError) {
    console.error("capacity check failed", countError);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500, headers);
  }
  const redirect = (tierCount ?? 0) >= cap ? "/waitlist" : "/thank-you";

  const { error: insertError } = await supabase.from("applications").insert({
    full_name: fullName,
    email,
    phone,
    linkedin_url: linkedinUrl,
    instagram_handle: (instagramHandle as string).replace(/^@/, ""),
    affiliation,
    domain_sector: domainSector,
    city,
    tier,
    delegate_status: delegateStatus,
    media_waiver_consent: true,
    privacy_consent: true,
    source,
  });
  if (insertError) {
    console.error("insert failed", insertError);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500, headers);
  }

  const name = firstName(fullName as string);
  const { subject, html } = tier === "vip_delegate" ? vipEmail(name) : observerEmail(name);
  await sendEmail(email, name, subject, html);

  return json({ ok: true, redirect }, 200, headers);
}

async function handlePartnerInquiry(body: Record<string, unknown>, headers: Record<string, string>) {
  const workEmail = typeof body.work_email === "string" ? body.work_email.trim() : "";
  if (!isValidEmail(workEmail)) {
    return json({ ok: false, error: "Please enter a valid work email address." }, 400, headers);
  }

  if (await isRateLimited("partner_inquiries", "work_email", workEmail)) {
    return json(
      { ok: false, error: "Too many submissions. Please try again in a few minutes." },
      429,
      headers,
    );
  }

  const name = body.name;
  const organization = body.organization;
  const role = body.role;
  const interest = body.interest;
  const message = isNonEmptyString(body.message) ? body.message : null;

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(organization) ||
    !isNonEmptyString(role) ||
    !isNonEmptyString(interest) ||
    !PARTNER_INTERESTS.includes(interest as string)
  ) {
    return json({ ok: false, error: "Please complete all required fields." }, 400, headers);
  }

  if (body.privacy_consent !== true) {
    return json(
      { ok: false, error: "Please accept the privacy terms to continue." },
      400,
      headers,
    );
  }

  const { error: insertError } = await supabase.from("partner_inquiries").insert({
    name,
    organization,
    work_email: workEmail,
    role,
    interest,
    message,
    privacy_consent: true,
  });
  if (insertError) {
    console.error("insert failed", insertError);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500, headers);
  }

  const first = firstName(name as string);
  const { subject, html } = partnerEmail(first);
  await sendEmail(workEmail, first, subject, html);

  return json({ ok: true, redirect: "/thank-you" }, 200, headers);
}
