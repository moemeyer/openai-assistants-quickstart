import { NextRequest } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return new Response("Stripe not configured", { status: 500 });
  }
  const stripe = new Stripe(secret, { apiVersion: "2023-10-16" });
  const { priceId } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url:
      process.env.STRIPE_SUCCESS_URL || "https://example.com/success",
    cancel_url:
      process.env.STRIPE_CANCEL_URL || "https://example.com/cancel",
  });
  return Response.json({ url: session.url });
}
