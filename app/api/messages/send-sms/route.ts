import { NextRequest } from "next/server";
import twilio from "twilio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { to, body } = await req.json();
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !from) {
    return new Response("Twilio not configured", { status: 500 });
  }
  const client = twilio(accountSid, authToken);
  const message = await client.messages.create({ from, to, body });
  return Response.json({ sid: message.sid });
}
