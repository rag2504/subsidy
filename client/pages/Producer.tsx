import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";

export default function Producer() {
  const [name, setName] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [programId, setProgramId] = useState("");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/gov/programs")
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPrograms(data);
          if (data[0]) setProgramId(data[0].id);
        } else {
          console.error("API returned non-array data:", data);
          setPrograms([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load programs:", error);
        setPrograms([]);
      });
  }, []);

  useEffect(() => {
    // Load projects after login (OTP-based token present)
    fetch("/api/producer/projects", withAuthHeaders())
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("API returned non-array data:", data);
          setProjects([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load projects:", error);
        setProjects([]);
      });
  }, []);

  return (
    <AuthGate requiredRole="producer">
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Producer Dashboard</h1>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Create Project</h2>
          <form className="mt-3 grid gap-2 md:grid-cols-3" onSubmit={async (e)=>{e.preventDefault(); const r= await fetch("/api/producer/projects/create", withAuthHeaders({ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name }) })); const d= await r.json(); setProjects((p)=>[...p, d]); setName(""); }}>
            <input className="rounded-md border px-3 py-2 text-sm" placeholder="Project name" value={name} onChange={(e)=>setName(e.target.value)} />
            <select className="rounded-md border px-3 py-2 text-sm" value={programId} onChange={(e)=>setProgramId(e.target.value)}>
              {programs.map((p)=> (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
            <Button type="submit">Create</Button>
          </form>
          <ul className="mt-3 space-y-2">
            {projects.map((p)=> (<li key={p.id || p.projectId} className="rounded-md border p-3 text-sm">{p.name} <span className="text-muted-foreground">({p.id || p.projectId})</span> • {p.status}</li>))}
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Submit Daily Data (OTP session)</h2>
          <DailyDataForm />
        </section>
      </div>
    </AuthGate>
  );
}

function DailyDataForm(){
  const [projectId, setProjectId] = useState("");
  const [kwh, setKwh] = useState("");
  return (
    <form className="grid gap-2 md:grid-cols-4" onSubmit={async (e)=>{e.preventDefault(); await fetch("/api/producer/data", withAuthHeaders({ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ projectId, kwh: Number(kwh) }) })); setKwh(""); }}>
      <input className="rounded-md border px-3 py-2 text-sm" placeholder="Project ID" value={projectId} onChange={(e)=>setProjectId(e.target.value)} />
      <input className="rounded-md border px-3 py-2 text-sm" placeholder="kWh produced" value={kwh} onChange={(e)=>setKwh(e.target.value)} />
      <div className="md:col-span-2"><Button type="submit">Submit</Button></div>
    </form>
  );
}
