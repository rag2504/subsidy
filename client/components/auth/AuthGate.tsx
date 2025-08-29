import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authHeader, clearToken, getRole, setToken } from "@/lib/auth";

export default function AuthGate({ requiredRole, children }: { requiredRole: string; children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const role = getRole();

  if (role === requiredRole) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border bg-card p-3 text-sm text-muted-foreground flex items-center justify-between">
          <span>Signed in as <span className="font-medium">{role}</span> • {email || "session"}</span>
          <Button variant="secondary" onClick={() => { clearToken(); location.reload(); }}>Sign out</Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Sign in as {requiredRole}</h2>
      <form className="mt-3 grid gap-2 md:grid-cols-3" onSubmit={async (e) => { e.preventDefault(); }}>
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex gap-2">
          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button type="button" onClick={async () => { setStatus(null); const r = await fetch("/api/auth/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); setStatus(r.ok ? "OTP sent" : "Failed to send OTP"); }}>Send OTP</Button>
        </div>
        <Button type="button" onClick={async () => { setStatus(null); const r = await fetch("/api/auth/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, role: requiredRole }) }); const data = await r.json().catch(() => null); if (data?.token) { setToken(data.token); setStatus("Signed in"); location.reload(); } else { setStatus("Invalid OTP"); } }}>Verify & Sign in</Button>
      </form>
      {status && <div className="mt-2 text-sm text-muted-foreground">{status}</div>}
      <div className="mt-3 text-xs text-muted-foreground">We use email OTP and JWT. After sign-in, your requests will include Authorization headers automatically.</div>
    </section>
  );
}

export function withAuthHeaders(init?: RequestInit): RequestInit {
  return { ...init, headers: { ...(init?.headers || {}), ...authHeader(), ...(init?.headers as any) } };
}
