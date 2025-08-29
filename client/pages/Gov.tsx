import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";

export default function Gov() {
  return (
    <AuthGate requiredRole="gov">
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Gov Admin Dashboard</h1>
        <Programs />
        <PendingProjects />
        <Milestones />
        <Release />
        <Governance />
      </div>
    </AuthGate>
  );
}

function Programs() {
  const [name, setName] = useState("Green H₂ Pilot 2025");
  const [programs, setPrograms] = useState<any[]>([]);
  const load = () => fetch("/api/gov/programs").then((r) => r.json()).then(setPrograms);
  useEffect(() => { load(); }, []);
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Programs</h2>
      <form className="mt-3 flex gap-2" onSubmit={async (e) => { e.preventDefault(); await fetch("/api/gov/programs", withAuthHeaders({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) })); setName(""); load(); }}>
        <input className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Program name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit">Create</Button>
      </form>
      <ul className="mt-3 grid gap-2 md:grid-cols-3">
        {programs.map((p) => (
          <li key={p.id} className="rounded-md border p-3 text-sm"><div className="font-medium">{p.name}</div><div className="text-muted-foreground">id: {p.id}</div></li>
        ))}
      </ul>
    </section>
  );
}

function PendingProjects() {
  const [list, setList] = useState<any[]>([]);
  const load = () => fetch("/api/gov/projects?status=pending", withAuthHeaders()).then((r) => r.json()).then(setList);
  useEffect(() => { load(); }, []);
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Pending Projects</h2>
      {list.length === 0 && <div className="text-sm text-muted-foreground mt-2">No pending projects.</div>}
      <ul className="mt-3 grid gap-2">
        {list.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div>
              <div className="font-medium">{p.name} <span className="text-muted-foreground">({p.id})</span></div>
              <div className="text-muted-foreground">Program: {p.program}</div>
            </div>
            <Button onClick={async () => { await fetch(`/api/gov/projects/${p.id}/approve`, withAuthHeaders({ method: "POST" })); load(); }}>Approve</Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Milestones() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [programId, setProgramId] = useState("");
  const [key, setKey] = useState("M1");
  const [title, setTitle] = useState("10 MWh Renewable Input");
  const [amount, setAmount] = useState("10000");
  const [unit, setUnit] = useState("MWh");
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { fetch("/api/gov/programs").then((r) => r.json()).then((ps) => { setPrograms(ps); if (ps[0]) setProgramId(ps[0].id); }); }, []);
  useEffect(() => { if (programId) fetch(`/api/gov/milestones?programId=${programId}`).then((r) => r.json()).then(setList); }, [programId]);
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Milestones</h2>
      <form className="mt-3 grid gap-2 md:grid-cols-5" onSubmit={async (e) => { e.preventDefault(); await fetch("/api/gov/milestones", withAuthHeaders({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ programId, key, title, amount: Number(amount), unit }) })); setKey(""); setTitle(""); setAmount(""); fetch(`/api/gov/milestones?programId=${programId}`).then((r) => r.json()).then(setList); }}>
        <select className="rounded-md border px-3 py-2 text-sm" value={programId} onChange={(e) => setProgramId(e.target.value)}>
          {programs.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </select>
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Key (e.g., M1)" value={key} onChange={(e) => setKey(e.target.value)} />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <div className="md:col-span-5"><Button type="submit">Add Milestone</Button></div>
      </form>
      <ul className="mt-3 grid gap-2 md:grid-cols-3">
        {list.map((m) => (<li key={m.key} className="rounded-md border p-3 text-sm"><div className="font-medium">{m.key}: {m.title}</div><div className="text-muted-foreground">{m.amount} {m.unit}</div></li>))}
      </ul>
    </section>
  );
}

function Release() {
  const [projectId, setProjectId] = useState("DEMO-PROJ-001");
  const [milestoneKey, setMilestoneKey] = useState("M1");
  const [amount, setAmount] = useState("10000");
  const [rail, setRail] = useState("bank");
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Trigger Release</h2>
      <form className="mt-3 grid gap-2 md:grid-cols-5" onSubmit={async (e) => { e.preventDefault(); setMsg(null); const r = await fetch("/api/gov/release", withAuthHeaders({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, milestoneKey, amount: Number(amount), rail }) })); setMsg(r.ok ? "Queued for bank" : "Error"); }}>
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Milestone Key" value={milestoneKey} onChange={(e) => setMilestoneKey(e.target.value)} />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select className="rounded-md border px-3 py-2 text-sm" value={rail} onChange={(e) => setRail(e.target.value)}>
          <option value="bank">Bank</option>
          <option value="onchain">On-chain (mock)</option>
        </select>
        <Button type="submit">Queue</Button>
      </form>
      {msg && <div className="mt-2 text-sm text-muted-foreground">{msg}</div>}
    </section>
  );
}

function Governance() {
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Revoke / Clawback</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        <Button onClick={async () => { await fetch("/api/gov/revoke", withAuthHeaders({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, reason: "policy" }) })); }}>Revoke</Button>
        <div />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Clawback Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button onClick={async () => { await fetch("/api/gov/clawback", withAuthHeaders({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, amount: Number(amount), reason: "violation" }) })); }}>Clawback</Button>
      </div>
    </section>
  );
}
