export const instance = process.env.BRIOSTACK_INSTANCE_NAME;
export const apiKey = process.env.BRIOSTACK_API_KEY;

async function brioFetch(path: string, options: RequestInit = {}) {
  if (!instance || !apiKey) {
    throw new Error("Briostack credentials missing");
  }
  const url = `https://${instance}.briostack.io/rest/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Briostack API error: ${res.status}`);
  }
  return res.json();
}

export async function getCustomer(customerId: string) {
  return brioFetch(`/customers/${customerId}`);
}
