import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authHeader, clearToken, getRole, setToken } from "@/lib/auth";

export default function AuthGate({
  requiredRole,
  children,
}: {
  requiredRole: string;
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const role = getRole();

  if (role === requiredRole) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border bg-card p-3 text-sm text-muted-foreground flex items-center justify-between">
          <span>
            Signed in as <span className="font-medium">{role}</span> •{" "}
            {email || "session"}
          </span>
          <Button
            variant="secondary"
            onClick={() => {
              clearToken();
              location.reload();
            }}
          >
            Sign out
          </Button>
        </div>
        {children}
      </div>
    );
  }

  const staffCreds: Record<string, { email: string; password: string }> = {
    gov: { email: "gov@gov.local", password: "Passw0rd!" },
    auditor: { email: "auditor@audit.local", password: "Passw0rd!" },
    bank: { email: "bank@bank.local", password: "Passw0rd!" },
  };

  if (["gov", "auditor", "bank"].includes(requiredRole)) {
    const creds = {
      gov: { email: "gov@gov.local", password: "Passw0rd!", title: "Government Login" },
      auditor: { email: "auditor@audit.local", password: "Passw0rd!", title: "Auditor Login" },
      bank: { email: "bank@bank.local", password: "Passw0rd!", title: "Bank Login" },
    } as const;
    const def = creds[requiredRole as "gov" | "auditor" | "bank"];
    return (
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">{def.title}</h2>
        <form className="mt-3 grid gap-2 md:grid-cols-3" onSubmit={async (e)=>{e.preventDefault(); setStatus(null); await fetch("/api/dev/seed-users", { method:"POST" }).catch(()=>{}); const r = await fetch("/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email: email || def.email, password: otp || def.password }) }); const d = await r.json().catch(()=>null); if(d?.token){ setToken(d.token); location.reload(); } else { setStatus("Login failed"); }}}>
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Username (email)" defaultValue={def.email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" type="password" placeholder="Password" defaultValue={def.password} onChange={(e)=>setOtp(e.target.value)} />
          <Button type="submit">Login</Button>
        </form>
        {status && <div className="mt-2 text-sm text-destructive">{status}</div>}
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Sign in as {requiredRole}</h2>

      {staffCreds[requiredRole] && (
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-md border p-3 text-sm bg-muted/40">
            <div className="font-medium">Quick Login (static creds)</div>
            <div className="text-muted-foreground">{staffCreds[requiredRole].email} / {staffCreds[requiredRole].password}</div>
          </div>
          <Button className="md:col-span-2" type="button" onClick={async () => { setStatus(null); await fetch("/api/dev/seed-users", { method: "POST" }).catch(()=>{}); const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(staffCreds[requiredRole]) }); const data = await r.json().catch(() => null); if (data?.token) { setToken(data.token); location.reload(); } else { setStatus("Login failed"); } }}>Login instantly</Button>
        </div>
      )}

      <form
        className="mt-6 grid gap-2 md:grid-cols-3"
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            type="button"
            onClick={async () => {
              setStatus(null);
              const r = await fetch("/api/auth/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              const data = await r.json().catch(() => ({}) as any);
              if (r.ok) {
                setStatus(
                  data.devOtp
                    ? `OTP sent (Dev OTP: ${data.devOtp})`
                    : "OTP sent",
                );
                if ((data as any).devOtp) setOtp((data as any).devOtp);
              } else {
                setStatus("Failed to send OTP");
              }
            }}
          >
            Send OTP
          </Button>
        </div>
        <Button
          type="button"
          onClick={async () => {
            setStatus(null);
            const r = await fetch("/api/auth/verify-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, otp, role: requiredRole }),
            });
            const data = await r.json().catch(() => null);
            if (data?.token) {
              setToken(data.token);
              setStatus("Signed in");
              location.reload();
            } else {
              setStatus("Invalid OTP");
            }
          }}
        >
          Verify & Sign in
        </Button>
      </form>
      {status && (
        <div className="mt-2 text-sm text-muted-foreground">{status}</div>
      )}
      <div className="mt-3 text-xs text-muted-foreground">Use Quick Login above for static credentials, or OTP flow.</div>
    </section>
  );
}

export function withAuthHeaders(init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...authHeader(),
      ...(init?.headers as any),
    },
  };
}
