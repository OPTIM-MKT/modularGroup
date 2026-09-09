import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

export const prerender = false;

const INTERESTS = [
  "group",
  "showerWalls",
  "modulWoods",
  "kuartzSurfaces",
  "modularVanityTops",
] as const;

const INTEREST_LABEL: Record<(typeof INTERESTS)[number], string> = {
  group: "Modular Group (general)",
  showerWalls: "Shower Walls",
  modulWoods: "Modul Woods",
  kuartzSurfaces: "Küartz Surfaces",
  modularVanityTops: "Modular Vanity Tops",
};

/** Validated again on the server: the client schema is a convenience, not a gate. */
const payloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(140).optional().or(z.literal("")),
  interest: z.enum(INTERESTS),
  message: z.string().trim().min(10).max(4000),
  locale: z.string().max(5).optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  );

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: "invalid_payload" }, 400);
  }

  const data = parsed.data;

  // Honeypot tripped — accept the request so the bot sees success, send nothing.
  if (data.website) return json({ ok: true }, 200);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL.",
    );
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Company", data.company || "—"],
    ["About", INTEREST_LABEL[data.interest]],
    ["Locale", data.locale ?? "en"],
  ];

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#15171c">
      <h2 style="margin:0 0 16px;font-size:18px">New enquiry — ${escapeHtml(INTEREST_LABEL[data.interest])}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#5f646d">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 6px;color:#5f646d">Message</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map((address) => address.trim()),
      replyTo: data.email,
      subject: `Modular Group — ${INTEREST_LABEL[data.interest]} — ${data.name}`,
      html,
      text: [
        ...rows.map(([label, value]) => `${label}: ${value}`),
        "",
        data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return json({ ok: false, error: "send_failed" }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[contact] Unexpected failure:", error);
    return json({ ok: false, error: "send_failed" }, 502);
  }
};
