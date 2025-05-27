export async function callNextBillionOptimizer({
  payload,
  apiKey,
}: {
  payload: Record<string, unknown>;
  apiKey?: string;
}) {
  const key =
    apiKey ||
    process.env.NEXT_PUBLIC_NEXTBILLION_API_KEY ||
    process.env.NEXTBILLION_API_KEY ||
    "";
  const url =
    "https://api.nextbillion.io/route-optimization/v1?key=" +
    encodeURIComponent(key);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NextBillion optimize failed ${res.status}: ${text}`);
  }
  return res.json();
}
