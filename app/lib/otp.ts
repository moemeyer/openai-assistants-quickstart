const store = new Map<string, { code: string; expires: number }>();

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOtp(id: string, code: string, ttlSeconds = 300) {
  store.set(id, { code, expires: Date.now() + ttlSeconds * 1000 });
}

export function verifyOtp(id: string, code: string): boolean {
  const entry = store.get(id);
  if (!entry) return false;
  if (entry.expires < Date.now()) {
    store.delete(id);
    return false;
  }
  const ok = entry.code === code;
  if (ok) store.delete(id);
  return ok;
}

export function isVerified(id: string): boolean {
  return !store.has(id);
}
