import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";
import { getToken, getRole, clearToken } from "@/lib/auth";
import { apiUrl } from "@/lib/api";

export default function Gov() {
  return (
    <AuthGate requiredRole="gov">
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Gov Admin Dashboard
        </h1>
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(apiUrl("/api/gov/programs"));
      
      if (!response.ok) {
        setError(`Failed to load programs: ${response.status}`);
        setPrograms([]);
        return;
      }
      
      const data = await response.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load programs");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    load();
  }, []);
  
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Programs</h2>
      
      {error && (
        <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded border">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="text-sm text-muted-foreground mt-2">
          Loading programs...
        </div>
      )}
      
      <form
        className="mt-3 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await fetch(
              apiUrl("/api/gov/programs"),
              withAuthHeaders({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
              }),
            );
            setName("");
            load();
          } catch (err) {
            setError("Failed to create program");
          }
        }}
      >
        <input
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Program name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit">Create</Button>
      </form>
      
      {!loading && !error && programs.length === 0 && (
        <div className="text-sm text-muted-foreground mt-3">
          No programs created yet.
        </div>
      )}
      
      {!loading && !error && programs.length > 0 && (
        <ul className="mt-3 grid gap-2 md:grid-cols-3">
          {programs.map((p) => (
            <li key={p.id || `program-${p.name}`} className="rounded-md border p-3 text-sm">
              <div className="font-medium">{p.name}</div>
              <div className="text-muted-foreground">id: {p.id}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PendingProjects() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = getToken();
      if (!token) {
        setError("Please sign in as a government user");
        setList([]);
        return;
      }
      
      const response = await fetch(apiUrl("/api/gov/projects?status=pending"), withAuthHeaders());
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please sign in again as a government user.");
        } else {
          setError(`Failed to load projects: ${response.status}`);
        }
        setList([]);
        return;
      }
      
      const data = await response.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects");
      setList([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const token = getToken();
    if (token) {
      load();
    } else {
      setError("Please sign in as a government user");
    }
  }, []);
  
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Pending Projects</h2>
      
      {error && (
        <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded border">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="text-sm text-muted-foreground mt-2">
          Loading projects...
        </div>
      )}
      
      {!loading && !error && list.length === 0 && (
        <div className="text-sm text-muted-foreground mt-2">
          No pending projects.
        </div>
      )}
      
      {!loading && !error && list.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {list.map((p) => (
            <li
              key={p.id || `project-${p.name}`}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <div className="font-medium">
                  {p.name} <span className="text-muted-foreground">({p.id})</span>
                </div>
                <div className="text-muted-foreground">Program: {p.program}</div>
              </div>
              <Button
                onClick={async () => {
                  try {
                    await fetch(
                      apiUrl(`/api/gov/projects/${p.id}/approve`),
                      withAuthHeaders({ method: "POST" }),
                    );
                    load();
                  } catch (err) {
                    setError("Failed to approve project");
                  }
                }}
              >
                Approve
              </Button>
            </li>
          ))}
        </ul>
      )}
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const loadPrograms = async () => {
    try {
      const response = await fetch(apiUrl("/api/gov/programs"));
      if (!response.ok) {
        setError("Failed to load programs");
        setPrograms([]);
        return;
      }
      const ps = await response.json();
      const programsList = Array.isArray(ps) ? ps : [];
      setPrograms(programsList);
      if (programsList.length > 0) {
        setProgramId(programsList[0].id);
      }
    } catch (err) {
      setError("Failed to load programs");
      setPrograms([]);
    }
  };
  
  const loadMilestones = async (pid: string) => {
    if (!pid) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(apiUrl(`/api/gov/milestones?programId=${pid}`));
      if (!response.ok) {
        setError("Failed to load milestones");
        setList([]);
        return;
      }
      const data = await response.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load milestones");
      setList([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPrograms();
  }, []);
  
  useEffect(() => {
    if (programId) {
      loadMilestones(programId);
    }
  }, [programId]);
  
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Milestones</h2>
      
      {error && (
        <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded border">
          {error}
        </div>
      )}
      
      {success && (
        <div className="text-sm text-green-600 mt-2 p-2 bg-green-50 rounded border">
          {success}
        </div>
      )}
      
      {loading && (
        <div className="text-sm text-muted-foreground mt-2">
          Loading milestones...
        </div>
      )}
      
      <form
        className="mt-3 grid gap-2 md:grid-cols-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setSuccess(null);
          
          try {
            const response = await fetch(
              apiUrl("/api/gov/milestones"),
              withAuthHeaders({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  programId,
                  key,
                  title,
                  amount: Number(amount),
                  unit,
                }),
              }),
            );
            
            if (response.ok) {
              setSuccess("Milestone created successfully!");
              setKey("");
              setTitle("");
              setAmount("");
              // Reload milestones
              await loadMilestones(programId);
            } else {
              const errorData = await response.json();
              setError(`Failed to create milestone: ${errorData.error || 'Unknown error'}`);
            }
          } catch (err) {
            setError("Failed to create milestone: Network error");
          }
        }}
      >
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
        >
          {programs.map((p) => (
            <option key={p.id || `program-${p.name}`} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Key (e.g., M1)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <Button type="submit">Create</Button>
      </form>
      
      {!loading && !error && list.length === 0 && (
        <div className="text-sm text-muted-foreground mt-3">
          No milestones defined for this program.
        </div>
      )}
      
      {!loading && !error && list.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {list.map((m) => {
            // Handle both data structures
            const key = m.key || m.code || 'Unknown';
            const title = m.title || m.formula || 'No title';
            const amount = m.amount || m.target || 0;
            const unit = m.unit || 'Unknown';
            
            return (
              <li key={m.id || `milestone-${key}`} className="rounded-md border p-3 text-sm">
                <div className="font-medium">{key}</div>
                <div className="text-muted-foreground">{title}</div>
                <div className="text-muted-foreground">
                  {amount.toLocaleString()} {unit}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Release() {
  const [projectId, setProjectId] = useState("DEMO-PROJ-001");
  const [milestoneKey, setMilestoneKey] = useState("M1");
  const [amount, setAmount] = useState("10000");
  const [rail, setRail] = useState("bank");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Trigger Release</h2>
      <form
        className="mt-3 grid gap-2 md:grid-cols-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setMsg(null);
          setLoading(true);
          
          try {
            const r = await fetch(
              apiUrl("/api/gov/release"),
              withAuthHeaders({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  projectId,
                  milestoneKey,
                  amount: Number(amount),
                  rail,
                }),
              }),
            );
            
            if (r.ok) {
              setMsg("✅ Release queued for bank successfully!");
            } else {
              const errorData = await r.json();
              setMsg(`❌ Error: ${errorData.error || 'Failed to queue release'}`);
            }
          } catch (err) {
            setMsg("❌ Network error. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
      >
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Milestone Key"
          value={milestoneKey}
          onChange={(e) => setMilestoneKey(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={rail}
          onChange={(e) => setRail(e.target.value)}
        >
          <option value="bank">Bank</option>
          <option value="onchain">On-chain (mock)</option>
        </select>
        <Button type="submit" disabled={loading}>
          {loading ? "Queuing..." : "Queue"}
        </Button>
      </form>
      {msg && (
        <div className={`mt-2 text-sm p-3 rounded-md ${
          msg.includes("✅") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {msg}
        </div>
      )}
    </section>
  );
}

function Governance() {
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [revokeMsg, setRevokeMsg] = useState<string | null>(null);
  const [clawbackMsg, setClawbackMsg] = useState<string | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [clawbackLoading, setClawbackLoading] = useState(false);
  
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">Revoke / Clawback</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <Button
          disabled={revokeLoading || !projectId}
          onClick={async () => {
            setRevokeMsg(null);
            setRevokeLoading(true);
            
            try {
              const response = await fetch(
                apiUrl("/api/gov/revoke"),
                withAuthHeaders({
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ projectId, reason: "policy" }),
                }),
              );
              
              if (response.ok) {
                setRevokeMsg("✅ Project revoked successfully!");
              } else {
                const errorData = await response.json();
                setRevokeMsg(`❌ Error: ${errorData.error || 'Failed to revoke project'}`);
              }
            } catch (err) {
              setRevokeMsg("❌ Network error. Please try again.");
            } finally {
              setRevokeLoading(false);
            }
          }}
        >
          {revokeLoading ? "Revoking..." : "Revoke"}
        </Button>
        <div />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Clawback Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          disabled={clawbackLoading || !projectId || !amount}
          onClick={async () => {
            setClawbackMsg(null);
            setClawbackLoading(true);
            
            try {
              const response = await fetch(
                apiUrl("/api/gov/clawback"),
                withAuthHeaders({
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    projectId,
                    amount: Number(amount),
                    reason: "violation",
                  }),
                }),
              );
              
              if (response.ok) {
                setClawbackMsg("✅ Clawback initiated successfully!");
              } else {
                const errorData = await response.json();
                setClawbackMsg(`❌ Error: ${errorData.error || 'Failed to initiate clawback'}`);
              }
            } catch (err) {
              setClawbackMsg("❌ Network error. Please try again.");
            } finally {
              setClawbackLoading(false);
            }
          }}
        >
          {clawbackLoading ? "Processing..." : "Clawback"}
        </Button>
      </div>
      
      {(revokeMsg || clawbackMsg) && (
        <div className="mt-3 space-y-2">
          {revokeMsg && (
            <div className={`text-sm p-3 rounded-md ${
              revokeMsg.includes("✅") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {revokeMsg}
            </div>
          )}
          {clawbackMsg && (
            <div className={`text-sm p-3 rounded-md ${
              clawbackMsg.includes("✅") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {clawbackMsg}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
