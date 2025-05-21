import { getCustomer } from "@/app/lib/briostack";
import { generateOtp, saveOtp } from "@/app/lib/otp";
import { sendSms } from "@/app/lib/notify";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { customerId } = await request.json();
  const customer = await getCustomer(customerId);
  const phone = customer?.billingMobile || customer?.billingPhone;
  if (!phone) {
    return new Response("Phone not found", { status: 400 });
  }
  const code = generateOtp();
  saveOtp(customerId, code);
  await sendSms(phone, `Your verification code is ${code}`);
  return new Response(JSON.stringify({ sent: true }));
}
