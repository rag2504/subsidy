import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Producer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [programId, setProgramId] = useState("");
  const [applied, setApplied] = useState<any | null>(null);

  useEffect(() => { fetch("/api/gov/programs").then((r) => r.json()).then((ps) => { setPrograms(ps); if (ps[0]) setProgramId(ps[0].id); }); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Producer Dashboard</h1>
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">Apply for Project</h2>
        <form className="mt-3 grid gap-2 md:grid-cols-4" onSubmit={async (e) => { e.preventDefault(); const r = await fetch("/api/producer/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ programId, name, email }) }); const data = await r.json(); setApplied(data); }}>
          <select className="rounded-md border px-3 py-2 text-sm" value={programId} onChange={(e) => setProgramId(e.target.value)}>
            {programs.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Contact email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit">Apply</Button>
        </form>
        {applied && <div className="mt-3 text-sm text-muted-foreground">Applied with ID: {applied.id}. Status: {applied.status}. Await Gov approval.</div>}
      </section>
    </div>
  );
}
