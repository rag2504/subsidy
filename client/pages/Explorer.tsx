import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";

type TimelineItem = {
  ts: string;
  type: string;
  label: string;
  details?: any;
};

type ProjectData = {
  id: string;
  program: string;
  project: string;
  status: string;
  email?: string;
  createdAt?: string;
  items: TimelineItem[];
  statistics: {
    totalAttestations: number;
    totalDisbursements: number;
    totalAmount: number;
    milestones: number;
  };
};

type ProjectSummary = {
  id: string;
  name: string;
  program: string;
  programName: string;
  status: string;
  email?: string;
  createdAt?: string;
};

const DEMO_PROJECT_ID = "DEMO-PROJ-001";

export default function Explorer() {
  const [qid, setQid] = useState(DEMO_PROJECT_ID);
  const [query, setQuery] = useState<string | null>(null);
  const [remote, setRemote] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<ProjectSummary[]>([]);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/api/seed"), { method: "POST" })
      .then(() => setQuery(DEMO_PROJECT_ID))
      .catch(() => setQuery(DEMO_PROJECT_ID));
  }, []);

  useEffect(() => {
    // Load available projects
    fetch(apiUrl("/api/explorer/projects"))
      .then(r => r.json())
      .then(setAvailableProjects)
      .catch(() => setAvailableProjects([]));
  }, []);

  useEffect(() => {
    if (!query) return;
    setError(null);
    setRemote(null);
    setLoading(true);
    
    fetch(apiUrl(`/api/explorer/project/${encodeURIComponent(query)}`))
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(setRemote)
      .catch(() => setError("Project not found"))
      .finally(() => setLoading(false));
  }, [query]);

  const data = useMemo(() => {
    if (remote) return remote as ProjectData;
    return null;
  }, [remote]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "bg-green-500/10 text-green-600";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "rejected":
      case "revoked":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "program_created":
        return "🏛️";
      case "project_created":
        return "📋";
      case "project_approved":
        return "✅";
      case "milestone_defined":
        return "🎯";
      case "attested":
        return "🔍";
      case "release_queued":
        return "⏳";
      case "released":
        return "💰";
      case "revoked":
        return "❌";
      case "clawback":
        return "↩️";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Public Audit Explorer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Search any Project ID to view a comprehensive, tamper-evident audit trail of
          programs, milestones, attestations, and disbursements.
        </p>
        
        {/* Search Form */}
        <form
          className="mt-6 flex w-full max-w-xl items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(qid.trim());
            setShowProjects(false);
          }}
        >
          <input
            value={qid}
            onChange={(e) => setQid(e.target.value)}
            placeholder={`Try: ${DEMO_PROJECT_ID}`}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button type="submit" className="h-10 px-5" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
        
        {/* Project Discovery */}
        <div className="mt-4 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProjects(!showProjects)}
          >
            {showProjects ? "Hide" : "Show"} Available Projects ({availableProjects.length})
          </Button>
          {availableProjects.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Click on any project to view its audit trail
            </span>
          )}
        </div>
        
        {error && <div className="mt-3 text-sm text-destructive">{error}</div>}
      </section>

      {/* Available Projects List */}
      {showProjects && availableProjects.length > 0 && (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Available Projects</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {availableProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setQid(project.id);
                  setQuery(project.id);
                  setShowProjects(false);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-sm truncate">{project.name}</div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {project.programName}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {project.id}
                </div>
                {project.createdAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {loading && (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading project data...</div>
          </div>
        </section>
      )}

      {data && (
        <>
          {/* Project Overview */}
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Project
                </div>
                <div className="font-semibold text-lg">
                  {data.project}{" "}
                  <span className="text-muted-foreground">({data.id})</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Program: {data.program}
                </div>
                {data.email && (
                  <div className="text-sm text-muted-foreground">
                    Contact: {data.email}
                  </div>
                )}
                {data.createdAt && (
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(data.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-lg font-bold text-primary">{data.statistics.totalAttestations}</div>
                    <div className="text-xs text-muted-foreground">Attestations</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-lg font-bold text-primary">{data.statistics.totalDisbursements}</div>
                    <div className="text-xs text-muted-foreground">Disbursements</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-lg font-bold text-primary">${data.statistics.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Released</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-lg font-bold text-primary">{data.statistics.milestones}</div>
                    <div className="text-xs text-muted-foreground">Milestones</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Audit Timeline</h2>
            <ol className="space-y-4">
              {data.items.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  No events found for this Project ID.
                </li>
              )}
              {data.items.map((it, i) => (
                <li key={i} className="relative pl-12">
                  <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-sm">{getEventIcon(it.type)}</span>
                  </div>
                  <div className="text-sm font-medium">{it.label}</div>
                  {it.details && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {formatDetails(it.details)}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground/80">
                    {new Date(it.ts).toLocaleString()}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      {!data && !loading && (
        <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          <div className="text-center py-8">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium mb-2">Search for a Project</div>
            <div>Use the demo Project ID above to see a fully populated audit trail, or search for any existing project ID.</div>
            {availableProjects.length > 0 && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowProjects(true)}
                >
                  Browse Available Projects
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function formatDetails(d: any) {
  if (typeof d === "string") return d;
  try {
    const entries = Object.entries(d);
    if (entries.length === 0) return "";
    
    return entries
      .map(([k, v]) => {
        const key = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (typeof v === 'number') {
          return `${key}: ${v.toLocaleString()}`;
        }
        return `${key}: ${v}`;
      })
      .join(" • ");
  } catch {
    return String(d);
  }
}
