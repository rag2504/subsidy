import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";

export default function Producer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [programId, setProgramId] = useState("");
  const [applied, setApplied] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <AuthGate requiredRole="producer">
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Producer Dashboard
        </h1>
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Apply for Project</h2>
          <form
            className="mt-3 grid gap-2 md:grid-cols-4"
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
            <select
              className="rounded-md border px-3 py-2 text-sm"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              disabled={loading}
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
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Contact email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Apply</Button>
          </form>
          {applied && (
            <div className={`mt-3 text-sm p-3 rounded-md ${
              applied.error 
                ? "bg-red-50 text-red-700 border border-red-200" 
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {applied.error ? (
                `❌ Error: ${applied.error}`
              ) : (
                `✅ Applied with ID: ${applied.id}. Status: ${applied.status}. Await Gov approval.`
              )}
            </div>
          )}
        </section>
      </div>
    </AuthGate>
  );
}
