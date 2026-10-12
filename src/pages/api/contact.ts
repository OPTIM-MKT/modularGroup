import type { APIRoute } from "astro";
import { Resend } from "resend";
import { renderToString } from "react-dom/server";
import React from "react";
import {
  contactSchema,
  getInterestLabel,
} from "@/components/contact/contact.schema";
import { EmailTemplate } from "@/components/contact/email-template";

export const prerender = false;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: "invalid_payload", details: parsed.error }, 400);
  }

  const data = parsed.data;

  // Honeypot tripped — accept the request so the bot sees success, send nothing.
  if (data.website && data.website.trim().length > 0) {
    return json({ ok: true }, 200);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.RESEND_TO ?? import.meta.env.CONTACT_TO_EMAIL ?? "sistemas@shower-walls.net";
  const from = import.meta.env.RESEND_FROM ?? import.meta.env.CONTACT_FROM_EMAIL ?? "Shower Walls <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[contact] Missing RESEND_API_KEY.");
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const interestLabel = getInterestLabel(data.interest);

  const html = renderToString(
    React.createElement(EmailTemplate, {
      data,
      interestLabel,
    }),
  );

  const plainText = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Company: ${data.company || "—"}`,
    `Interest: ${interestLabel}`,
    `Locale: ${data.locale ?? "en"}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { data: resendData, error } = await resend.emails.send({
      from,
      to: to.split(",").map((address: string) => address.trim()),
      replyTo: data.email,
      subject: `New Inquiry (${interestLabel}) — ${data.name} | Shower Walls`,
      html,
      text: plainText,
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return json({ ok: false, error: "send_failed", message: error.message }, 502);
    }

    return json({ ok: true, id: resendData?.id }, 200);
  } catch (error) {
    console.error("[contact] Unexpected failure:", error);
    return json({ ok: false, error: "send_failed" }, 502);
  }
};
