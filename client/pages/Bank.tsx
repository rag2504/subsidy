import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Bank() {
  const [queue, setQueue] = useState<any[]>([]);
  const load = () => fetch("/api/bank/queue").then((r) => r.json()).then(setQueue);
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bank Ops Console</h1>
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">Payout Queue</h2>
        <ul className="mt-3 grid gap-2">
          {queue.length === 0 && <div className="text-sm text-muted-foreground">No queued disbursements.</div>}
          {queue.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm">
              <div>
                <div className="font-medium">{d.projectId} • {d.milestoneKey}</div>
                <div className="text-muted-foreground">Amount: {d.amount} • Rail: {d.rail}</div>
              </div>
              <Approve id={d.id} onDone={load} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Approve({ id, onDone }: { id: string; onDone: () => void }) {
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form className="flex items-center gap-2" onSubmit={async (e) => { e.preventDefault(); setBusy(true); await fetch("/api/bank/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, bankRef: ref }) }); setBusy(false); onDone(); }}>
      <input className="rounded-md border px-3 py-2 text-sm" placeholder="Bank ref" value={ref} onChange={(e) => setRef(e.target.value)} />
      <Button type="submit" disabled={busy}>Approve</Button>
    </form>
  );
}
