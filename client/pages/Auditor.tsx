import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";
import { apiUrl } from "@/lib/api";

type Project = {
  id: string;
  name: string;
  program: string;
  programName: string;
  status: string;
  email?: string;
  milestones: Milestone[];
  attestations: Attestation[];
};

type Milestone = {
  key: string;
  title: string;
  amount: number;
  unit: string;
};

type Attestation = {
  milestoneKey: string;
  value: number;
  unit: string;
  dataHash: string;
  signer: string;
  createdAt: string;
};

export default function Auditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [deadline, setDeadline] = useState("");
  const [nonce, setNonce] = useState("1");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Load available projects
  useEffect(() => {
    fetch(apiUrl("/api/auditor/projects"), withAuthHeaders())
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Expected array but got:", data);
          setProjects([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      })
      .finally(() => setProjectsLoading(false));
  }, []);

  // Auto-fill unit when milestone is selected
  useEffect(() => {
    if (selectedMilestone) {
      setUnit(selectedMilestone.unit);
    }
  }, [selectedMilestone]);

  // Set default deadline (1 hour from now)
  useEffect(() => {
    const defaultDeadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    setDeadline(defaultDeadline.toString());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedMilestone || !evidenceFile) {
      setMsg("Please select a project, milestone, and evidence file");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const response = await fetch(
        apiUrl("/api/auditor/attest"),
        withAuthHeaders({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: selectedProject.id,
            milestoneKey: selectedMilestone.key,
            value: Number(value),
            unit,
            dataHash,
            signer,
          }),
        }),
      );

      const data = await response.json();
      
      if (response.ok) {
        setMsg(`✅ Attestation submitted successfully! Transaction: ${data.tx}`);
        // Clear form
        setValue("");
        setEvidenceFile(null);
        setNonce((prev) => (parseInt(prev) + 1).toString());
        // Refresh projects to show updated attestations
        fetch(apiUrl("/api/auditor/projects"), withAuthHeaders())
          .then(r => r.json())
          .then(setProjects);
      } else {
        setMsg(`❌ Error: ${data.error || "Failed to submit attestation"}`);
      }
    } catch (error) {
      setMsg("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500/10 text-green-600";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const isMilestoneAttested = (milestoneKey: string) => {
    return selectedProject?.attestations.some(a => a.milestoneKey === milestoneKey);
  };

  return (
    <AuthGate requiredRole="auditor">
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Auditor Console
        </h1>

        {/* Project Selection */}
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Select Project</h2>
          
          {projectsLoading ? (
            <div className="text-sm text-muted-foreground">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No approved projects available for attestation.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={project.id || `project-${index}`}
                  className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    setSelectedProject(project);
                    setSelectedMilestone(null);
                    setValue("");
                    setUnit("");
                    setDataHash("");
                    setSigner("");
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
                  <div className="text-xs text-muted-foreground mt-1">
                    Milestones: {project.milestones.length} | Attestations: {project.attestations.length}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Attestation Form */}
        {selectedProject && (
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold mb-4">
              Submit Attestation for {selectedProject.name}
            </h2>
            
            {/* Milestone Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Select Milestone</h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {selectedProject.milestones.map((milestone, index) => {
                  const isAttested = isMilestoneAttested(milestone.key);
                  return (
                    <div
                      key={milestone.key || `milestone-${index}`}
                      className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedMilestone?.key === milestone.key
                          ? "border-primary bg-primary/5"
                          : isAttested
                          ? "border-green-200 bg-green-50"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        if (!isAttested) {
                          setSelectedMilestone(milestone);
                          setValue("");
                          setUnit(milestone.unit);
                          setEvidenceFile(null);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-medium text-sm">{milestone.key}</div>
                        {isAttested && (
                          <span className="text-green-600 text-xs">✓ Attested</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {milestone.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${milestone.amount.toLocaleString()} {milestone.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attestation Form */}
            {selectedMilestone && !isMilestoneAttested(selectedMilestone.key) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Project ID</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm mt-1 bg-muted"
                      value={selectedProject.id}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Milestone Key</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm mt-1 bg-muted"
                      value={selectedMilestone.key}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Value *</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm mt-1"
                      placeholder="Enter measured value"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      type="number"
                      step="any"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm mt-1"
                      placeholder="Unit of measurement"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Evidence File *</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm mt-1"
                      type="file"
                      onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload evidence file (PDF, image, etc.)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deadline (Unix timestamp)</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm mt-1"
                      placeholder="Deadline"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      type="number"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nonce</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm mt-1"
                      placeholder="Nonce"
                      value={nonce}
                      onChange={(e) => setNonce(e.target.value)}
                      type="number"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Submitting..." : "Submit Attestation"}
                </Button>
                
                {msg && (
                  <div className={`text-sm p-3 rounded-md ${
                    msg.includes("✅") 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {msg}
                  </div>
                )}
              </form>
            )}

            {selectedMilestone && isMilestoneAttested(selectedMilestone.key) && (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium mb-2">Milestone Already Attested</div>
                <div className="text-sm text-muted-foreground">
                  This milestone has already been attested. Select another milestone to continue.
                </div>
              </div>
            )}
          </section>
        )}

        {/* Instructions */}
        {!selectedProject && !projectsLoading && (
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-center py-8">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-medium mb-2">Select a Project</div>
              <div className="text-sm text-muted-foreground">
                Choose an approved project above to begin attestation process.
              </div>
            </div>
          </section>
        )}
      </div>
    </AuthGate>
  );
}
