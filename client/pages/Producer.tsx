import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";

interface Project {
  id: string;
  name: string;
  email: string;
  program: string;
  status: string;
  createdAt: string;
  milestones?: any[];
}

export default function Producer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [programId, setProgramId] = useState("");
  const [applied, setApplied] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    // Load programs
    fetch("/api/gov/programs")
      .then((r) => r.json())
      .then((ps) => {
        setPrograms(ps);
        if (ps[0]) setProgramId(ps[0].id);
      })
      .catch((error) => {
        console.error("Failed to fetch programs:", error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Load user's projects
    loadMyProjects();
  }, []);

  const loadMyProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await fetch("/api/producer/projects", withAuthHeaders());
      if (response.ok) {
        const data = await response.json();
        setMyProjects(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to load projects");
        setMyProjects([]);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setMyProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthGate requiredRole="producer">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Producer Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subsidy applications and track project progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myProjects.filter(p => p.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myProjects.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apply for New Project */}
        <Card>
          <CardHeader>
            <CardTitle>Apply for New Project</CardTitle>
            <CardDescription>
              Submit a new application for government subsidy programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const r = await fetch(
                    "/api/producer/projects",
                    withAuthHeaders({
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ programId, name, email }),
                    }),
                  );
                  const data = await r.json();
                  if (r.ok) {
                    setApplied(data);
                    setName("");
                    setEmail("");
                    loadMyProjects(); // Refresh projects list
                  } else {
                    console.error("Failed to apply:", data);
                    setApplied({ error: data.error || "Failed to apply for project" });
                  }
                } catch (error) {
                  console.error("Network error:", error);
                  setApplied({ error: "Network error. Please try again." });
                }
              }}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Program</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    disabled={loading}
                    required
                  >
                    {loading ? (
                      <option>Loading programs...</option>
                    ) : programs.length === 0 ? (
                      <option>No programs available</option>
                    ) : (
                      programs.map((p, index) => (
                        <option key={p.id || index} value={p.id}>
                          {p.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Enter project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Enter contact email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Submit Application
              </Button>
            </form>
            
            {applied && (
              <div className={`mt-4 text-sm p-3 rounded-md ${
                applied.error 
                  ? "bg-red-50 text-red-700 border border-red-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {applied.error ? (
                  `❌ Error: ${applied.error}`
                ) : (
                  `✅ Application submitted successfully! Project ID: ${applied.id}. Status: ${applied.status}. Awaiting government approval.`
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Projects */}
        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
            <CardDescription>
              Track the status of your subsidy applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProjects ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading your projects...</div>
              </div>
            ) : myProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No projects found. Apply for your first project above.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Project ID: {project.id} • Program: {project.program}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Contact: {project.email} • Created: {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    {project.milestones && project.milestones.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="text-sm font-medium mb-2">Milestones</h4>
                        <div className="space-y-2">
                          {project.milestones.map((milestone: any, index: number) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{milestone.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {milestone.status || 'Pending'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
