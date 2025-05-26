import { NextRequest } from "next/server";
import sgMail from "@sendgrid/mail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { to, subject, text, html } = await req.json();
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!apiKey || !from) {
    return new Response("SendGrid not configured", { status: 500 });
  }
  sgMail.setApiKey(apiKey);
  await sgMail.send({ to, from, subject, text, html });
  return Response.json({ success: true });
}
