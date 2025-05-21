import { verifyOtp } from "@/app/lib/otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { customerId, code } = await request.json();
  const ok = verifyOtp(customerId, code);
  return new Response(JSON.stringify({ valid: ok }), { status: ok ? 200 : 401 });
}
