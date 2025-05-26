import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { endpoint, method = "GET", payload, query } = await req.json();
  const domain = process.env.GHL_API_DOMAIN;
  const key = process.env.GHL_API_KEY;
  if (!domain || !key) {
    return new Response("GHL not configured", { status: 500 });
  }
  const url = new URL(`https://${domain}${endpoint}`);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const bodyText = await res.text();
  return new Response(bodyText, { status: res.status });
}
