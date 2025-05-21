import { getCustomer } from "@/app/lib/briostack";
import { isVerified } from "@/app/lib/otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { customerId } = await request.json();
  if (!isVerified(customerId)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const customer = await getCustomer(customerId);
  return new Response(JSON.stringify(customer));
}
