type Entry = { otp: string; exp: number };

class InMemoryOTPStore {
  private store = new Map<string, Entry>();

  set(email: string, otp: string, ttlMs = 10 * 60 * 1000) {
    const exp = Date.now() + ttlMs;
    this.store.set(email.toLowerCase(), { otp, exp });
  }

  verify(email: string, otp: string) {
    const e = this.store.get(email.toLowerCase());
    if (!e) return false;
    if (Date.now() > e.exp) {
      this.store.delete(email.toLowerCase());
      return false;
    }
    const ok = e.otp === otp;
    if (ok) this.store.delete(email.toLowerCase());
    return ok;
  }
}

export const otpStore = new InMemoryOTPStore();
