import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  Shield, 
  BarChart3, 
  Download, 
  Eye,
  Globe,
  Database,
  Activity,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

type TimelineItem = {
  ts: string;
  label: string;
  details?: any;
};

const DEMO_PROJECT_ID = "DEMO-PROJ-001";

export default function Explorer() {
  const [qid, setQid] = useState(DEMO_PROJECT_ID);
  const [query, setQuery] = useState<string | null>(null);
  const [remote, setRemote] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'analytics' | 'carbon'>('overview');

  useEffect(() => {
    fetch("/api/seed", { method: "POST" })
      .then(() => setQuery(DEMO_PROJECT_ID))
      .catch(() => setQuery(DEMO_PROJECT_ID));
  }, []);

  useEffect(() => {
    if (!query) return;
    setError(null);
    setRemote(null);
    fetch(`/api/explorer/project/${encodeURIComponent(query)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(setRemote)
      .catch(() => setError("Not found"));
  }, [query]);

  const data = useMemo(() => {
    if (remote)
      return remote as {
        id: string;
        program: string;
        project: string;
        status: string;
        items: TimelineItem[];
      };
    return null;
  }, [remote]);

  // Mock analytics data
  const analytics = {
    totalSubsidy: "$2.4M",
    carbonCredits: "45.2K",
    milestonesCompleted: 3,
    successRate: "99.8%",
    avgProcessingTime: "2.3 days",
    totalProjects: 1247,
    activeProjects: 892,
    pendingClaims: 156
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            <span className="text-gradient">Public Audit Explorer</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transparent blockchain-powered subsidy tracking with real-time analytics, 
            carbon credit verification, and end-to-end audit trails.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto">
          <form
            className="flex w-full items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(qid.trim());
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={qid}
                onChange={(e) => setQid(e.target.value)}
                placeholder={`Search Project ID (e.g., ${DEMO_PROJECT_ID})`}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="btn-primary px-8 py-3">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* Global Analytics Dashboard */}
      <section className="max-w-7xl mx-auto">
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live Data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Subsidy</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalSubsidy}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+12.5% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Carbon Credits</p>
                  <p className="text-2xl font-bold text-white">{analytics.carbonCredits}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+8.3% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-white">{analytics.activeProjects}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+15.7% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{analytics.successRate}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+0.2% this month</div>
            </div>
          </div>
        </div>
      </section>

      {data && (
        <>
          {/* Project Overview */}
          <section className="max-w-7xl mx-auto">
            <div className="glass-card p-8 rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                <div>
                  <div className="text-sm uppercase tracking-wide text-gray-400 mb-2">
                    Project Details
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {data.project}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-medium">ID:</span> {data.id} • <span className="font-medium">Program:</span> {data.program}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary border border-primary/30">
                    <CheckCircle className="w-4 h-4" />
                    {data.status}
                  </span>
                  <Button className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 mb-8">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'timeline', label: 'Timeline', icon: Clock },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'carbon', label: 'Carbon Credits', icon: Leaf }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Project Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Subsidy</span>
                        <span className="text-white font-medium">$450,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Carbon Credits</span>
                        <span className="text-white font-medium">12,450 kg CO₂</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Milestones</span>
                        <span className="text-white font-medium">3/5 Completed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-white font-medium">2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Efficiency Score</span>
                        <span className="text-green-400 font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compliance Rate</span>
                        <span className="text-green-400 font-medium">100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time</span>
                        <span className="text-white font-medium">1.2 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trust Score</span>
                        <span className="text-green-400 font-medium">A+</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">Milestone M3 completed</span>
                        <span className="text-gray-500">2h ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">Auditor verification</span>
                        <span className="text-gray-500">1d ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-300">Subsidy disbursed</span>
                        <span className="text-gray-500">3d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Audit Timeline</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Info className="w-4 h-4" />
                      Immutable blockchain records
                    </div>
                  </div>
                  
                  <ol className="space-y-6">
                    {data.items.length === 0 && (
                      <li className="text-gray-400 text-center py-8">
                        No events found for this Project ID.
                      </li>
                    )}
                    {data.items.map((it, i) => (
                      <li key={i} className="relative pl-8">
                        <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-white"></div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-white font-medium">{it.label}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(it.ts).toLocaleString()}
                            </div>
                          </div>
                          {it.details && (
                            <div className="text-sm text-gray-300 bg-white/5 rounded-lg p-3 mt-2">
                              {formatDetails(it.details)}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Subsidy Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-white font-medium mb-4">Disbursement History</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Milestone M1</span>
                          <span className="text-white">$150,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Milestone M2</span>
                          <span className="text-white">$200,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Milestone M3</span>
                          <span className="text-white">$100,000</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 mt-3">
                          <div className="flex justify-between font-medium">
                            <span className="text-white">Total</span>
                            <span className="text-primary">$450,000</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Efficiency</span>
                            <span className="text-white">94.2%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Compliance</span>
                            <span className="text-white">100%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '100%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Timeline</span>
                            <span className="text-white">85%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '85%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'carbon' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Carbon Credit Tracking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Total Carbon Credits</p>
                          <p className="text-2xl font-bold text-white">12,450 kg CO₂</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Verified Credits</span>
                          <span className="text-green-400">12,450 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pending Verification</span>
                          <span className="text-yellow-400">0 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Value</span>
                          <span className="text-white">$24,900</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-white font-medium mb-4">Credit Generation History</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Milestone M1</span>
                          <span className="text-white">4,150 kg CO₂</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Milestone M2</span>
                          <span className="text-white">5,200 kg CO₂</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Milestone M3</span>
                          <span className="text-white">3,100 kg CO₂</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 mt-3">
                          <div className="flex justify-between font-medium">
                            <span className="text-white">Total</span>
                            <span className="text-green-400">12,450 kg CO₂</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {!data && (
        <section className="max-w-7xl mx-auto">
          <div className="glass-card p-8 rounded-3xl text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Explore</h3>
            <p className="text-gray-300 mb-6">
              Use the demo Project ID above to see a fully populated audit trail with 
              real-time analytics, carbon credit tracking, and detailed performance metrics.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% Transparent</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Real-time Data</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function formatDetails(d: any) {
  if (typeof d === "string") return d;
  try {
    return Object.entries(d)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
  } catch {
    return String(d);
  }
}
