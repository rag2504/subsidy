import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";
import { apiUrl } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function Bank() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/bank/queue"), withAuthHeaders());
      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication required. Please sign in as a bank user.");
        } else {
          setError(`Failed to load queue: ${response.status} ${response.statusText}`);
        }
        setQueue([]);
        return;
      }
      const data = await response.json();
      // Ensure data is an array
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading bank queue:", err);
      setError("Failed to load bank queue. Please try again.");
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken()) {
      load();
    }
  }, []);

  return (
    <AuthGate requiredRole="bank">
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Bank Ops Console
        </h1>
        
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={load}
            >
              Retry
            </Button>
          </div>
        )}

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Payout Queue</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={load}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
          
          {loading ? (
            <div className="mt-3 text-sm text-muted-foreground">
              Loading queue...
            </div>
          ) : (
            <ul className="mt-3 grid gap-2">
              {queue.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No queued disbursements.
                </div>
              )}
              {queue.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {d.projectId} • {d.milestoneKey}
                    </div>
                    <div className="text-muted-foreground">
                      Amount: {d.amount} • Rail: {d.rail}
                    </div>
                  </div>
                  <Approve id={d.id} onDone={load} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AuthGate>
  );
}

function Approve({ id, onDone }: { id: string; onDone: () => void }) {
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
                     const response = await fetch(
             apiUrl("/api/bank/approve"),
             withAuthHeaders({
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ id, bankRef: ref }),
             }),
           );
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            setError(errorData.error || `Failed to approve: ${response.status}`);
            return;
          }
          
          setRef("");
          onDone();
        } catch (err) {
          console.error("Error approving disbursement:", err);
          setError("Failed to approve disbursement. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex flex-col gap-1">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Bank ref"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          required
        />
        {error && (
          <div className="text-xs text-red-600">{error}</div>
        )}
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Approving..." : "Approve"}
      </Button>
    </form>
  );
}
