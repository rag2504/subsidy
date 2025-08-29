import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";

export default function Auditor() {
  const [projectId, setProjectId] = useState("DEMO-PROJ-001");
  const [milestoneKey, setMilestoneKey] = useState("M1");
  const [value, setValue] = useState("10");
  const [unit, setUnit] = useState("MWh");
  const [dataHash, setDataHash] = useState("0xabc");
  const [signer, setSigner] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Auditor Console</h1>
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">Submit Attestation (EIP-712 payload)</h2>
        <form className="mt-3 grid gap-2 md:grid-cols-6" onSubmit={async (e) => { e.preventDefault(); setMsg(null); const r = await fetch("/api/auditor/attest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, milestoneKey, value: Number(value), unit, dataHash, signer }) }); setMsg(r.ok ? "Submitted" : "Error or already exists"); }}>
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Milestone Key" value={milestoneKey} onChange={(e) => setMilestoneKey(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Data Hash" value={dataHash} onChange={(e) => setDataHash(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Signer (email)" value={signer} onChange={(e) => setSigner(e.target.value)} />
          <div className="md:col-span-6"><Button type="submit">Submit Attestation</Button></div>
        </form>
        {msg && <div className="mt-2 text-sm text-muted-foreground">{msg}</div>}
      </section>
    </div>
  );
}
