import { getCustomer } from "@/app/lib/briostack";
import { isVerified } from "@/app/lib/otp";
import { sendSms } from "@/app/lib/notify";

export const runtime = "nodejs";

function createPaymentLink(customerId: string, amount: number) {
  return `https://pay.example.com/${customerId}?amount=${amount}`;
}

export async function POST(request: Request) {
  const { customerId, amount } = await request.json();
  if (!isVerified(customerId)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const customer = await getCustomer(customerId);
  const link = createPaymentLink(customerId, amount);
  const phone = customer?.billingMobile || customer?.billingPhone;
  if (phone) {
    await sendSms(phone, `Pay here: ${link}`);
  }
  return new Response(JSON.stringify({ link }));
}
