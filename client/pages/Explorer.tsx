import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type TimelineItem = {
  ts: string;
  label: string;
  details?: string;
};

const DEMO_PROJECT_ID = "DEMO-PROJ-001";

export default function Explorer() {
  const [qid, setQid] = useState("");
  const [query, setQuery] = useState<string | null>(null);

  const data = useMemo(() => {
    if (query === DEMO_PROJECT_ID) {
      const items: TimelineItem[] = [
        { ts: "2025-01-10T09:00:00Z", label: "Program Created: Green H₂ Pilot 2025" },
        { ts: "2025-01-18T15:20:00Z", label: "Project Approved: Electrolyzer Alpha" },
        { ts: "2025-02-05T10:00:00Z", label: "Milestone M1 Defined: 10 MWh Renewable Input" },
        { ts: "2025-03-01T11:30:00Z", label: "Auditor Attested (EIP-712)", details: "value=10, unit=MWh, dataHash=0xabc…" },
        { ts: "2025-03-01T11:35:00Z", label: "Payment Released", details: "bankRefOrTx=BANK-REF-001" },
        { ts: "2025-04-10T10:00:00Z", label: "Milestone M2 Defined: 250 Kg H₂ Produced" },
        { ts: "2025-05-02T13:45:00Z", label: "Auditor Attested (EIP-712)", details: "value=250, unit=kgH2, dataHash=0xdef…" },
        { ts: "2025-05-02T13:50:00Z", label: "Payment Released", details: "bankRefOrTx=BANK-REF-002" },
      ];
      return { id: query, program: "Green H₂ Pilot 2025", project: "Electrolyzer Alpha", status: "Active", items };
    }
    if (!query) return null;
    return { id: query, program: "Unknown", project: "Not Found", status: "—", items: [] as TimelineItem[] };
  }, [query]);

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Public Audit Explorer</h1>
        <p className="mt-2 text-muted-foreground">Search any Project ID to view a tamper-evident audit trail of programs, milestones, attestations, and disbursements.</p>
        <form
          className="mt-6 flex w-full max-w-xl items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(qid.trim());
          }}
        >
          <input
            value={qid}
            onChange={(e) => setQid(e.target.value)}
            placeholder={`Try: ${DEMO_PROJECT_ID}`}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button type="submit" className="h-10 px-5">Search</Button>
        </form>
      </section>

      {data && (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Project</div>
              <div className="font-semibold">{data.project} <span className="text-muted-foreground">({data.id})</span></div>
              <div className="text-sm text-muted-foreground">Program: {data.program}</div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{data.status}</span>
          </div>

          <ol className="mt-6 space-y-4">
            {data.items.length === 0 && (
              <li className="text-sm text-muted-foreground">No events found for this Project ID.</li>
            )}
            {data.items.map((it, i) => (
              <li key={i} className="relative pl-8">
                <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="text-sm font-medium">{it.label}</div>
                {it.details && <div className="text-sm text-muted-foreground">{it.details}</div>}
                <div className="text-xs text-muted-foreground/80">{new Date(it.ts).toLocaleString()}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {!data && (
        <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Tip: Use the demo Project ID above to see a fully populated audit trail.
        </section>
      )}
    </div>
  );
}
