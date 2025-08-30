import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  BarChart3, 
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  Award,
  Activity,
  Database,
  Lock,
  UserCheck,
  Target,
  TrendingUp,
  AlertCircle,
  Info,
  Calendar,
  Zap,
  Globe,
  Bell,
  Settings,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  PieChart,
  LineChart,
  ShieldCheck,
  FileCheck,
  ClipboardCheck
} from "lucide-react";

export default function Auditor() {
  const [projectId, setProjectId] = useState("DEMO-PROJ-001");
  const [milestoneKey, setMilestoneKey] = useState("M1");
  const [value, setValue] = useState("10");
  const [unit, setUnit] = useState("MWh");
  const [dataHash, setDataHash] = useState("0xabc");
  const [signer, setSigner] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'attestations' | 'compliance' | 'reports' | 'settings'>('overview');
  const [pendingAudits, setPendingAudits] = useState<any[]>([]);
  const [completedAudits, setCompletedAudits] = useState<any[]>([]);

  // Mock data for enhanced dashboard
  const auditorStats = {
    totalAudits: 1247,
    completedToday: 23,
    pendingReviews: 8,
    complianceRate: "99.8%",
    avgProcessingTime: "1.2 hours",
    fraudDetected: 3,
    trustScore: "A+",
    carbonVerified: "45.2M kg"
  };

  useEffect(() => {
    // Load mock audit data
    setPendingAudits([
      { id: 1, project: "PROJ-001", type: "Milestone Verification", priority: "High", time: "2 hours ago" },
      { id: 2, project: "PROJ-045", type: "Data Validation", priority: "Medium", time: "4 hours ago" },
      { id: 3, project: "PROJ-089", type: "Compliance Check", priority: "Low", time: "1 day ago" }
    ]);
    
    setCompletedAudits([
      { id: 1, project: "PROJ-001", type: "Milestone M3", status: "Approved", time: "1 hour ago" },
      { id: 2, project: "PROJ-045", type: "Data Audit", status: "Approved", time: "3 hours ago" },
      { id: 3, project: "PROJ-089", type: "Compliance Review", status: "Rejected", time: "1 day ago" }
    ]);
  }, []);

  return (
    <AuthGate requiredRole="auditor">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              <span className="text-gradient">Auditor Console</span>
            </h1>
            <p className="text-xl text-gray-300">
              Advanced compliance verification with AI-powered fraud detection and blockchain transparency
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="btn-secondary">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Alerts</span>
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">New Audit</span>
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <section className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Audit Overview</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live Data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Audits</p>
                  <p className="text-2xl font-bold text-white">{auditorStats.totalAudits}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+12.5% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pending Reviews</p>
                  <p className="text-2xl font-bold text-white">{auditorStats.pendingReviews}</p>
                </div>
              </div>
              <div className="text-yellow-400 text-sm font-medium">Requires attention</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Compliance Rate</p>
                  <p className="text-2xl font-bold text-white">{auditorStats.complianceRate}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+0.2% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fraud Detected</p>
                  <p className="text-2xl font-bold text-white">{auditorStats.fraudDetected}</p>
                </div>
              </div>
              <div className="text-red-400 text-sm font-medium">Requires action</div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="glass-card p-6 rounded-2xl">
          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'attestations', label: 'Attestations', icon: FileCheck },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {completedAudits.slice(0, 3).map((audit) => (
                      <div key={audit.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          audit.status === 'Approved' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {audit.status === 'Approved' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{audit.project} - {audit.type}</p>
                          <p className="text-sm text-gray-400">Status: {audit.status}</p>
                        </div>
                        <span className="text-xs text-gray-500">{audit.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Audit Performance</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-white">99.8%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '99.8%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Efficiency</span>
                        <span className="text-white">94.2%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Timeline</span>
                        <span className="text-white">87.5%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '87.5%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Quality</span>
                        <span className="text-white">96.8%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '96.8%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full btn-secondary justify-start">
                      <FileCheck className="w-4 h-4 mr-2" />
                      New Attestation
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Search Projects
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Audit Settings
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Pending Audits</h3>
                  <div className="space-y-3">
                    {pendingAudits.map((audit) => (
                      <div key={audit.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div>
                          <p className="text-white font-medium text-sm">{audit.project}</p>
                          <p className="text-gray-400 text-xs">{audit.type}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          audit.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                          audit.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {audit.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attestations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Submit Attestation</h3>
                <div className="flex items-center gap-2">
                  <Button className="btn-secondary">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button className="btn-secondary">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border border-white/10">
                <h4 className="text-white font-medium mb-4">EIP-712 Attestation Form</h4>
                <form
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setMsg(null);
                    const r = await fetch(
                      "/api/auditor/attest",
                      withAuthHeaders({
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          projectId,
                          milestoneKey,
                          value: Number(value),
                          unit,
                          dataHash,
                          signer,
                        }),
                      }),
                    );
                    setMsg(r.ok ? "Attestation submitted successfully" : "Error or already exists");
                  }}
                >
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Project ID</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400"
                      placeholder="DEMO-PROJ-001"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Milestone Key</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400"
                      placeholder="M1"
                      value={milestoneKey}
                      onChange={(e) => setMilestoneKey(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Value</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400"
                      placeholder="10"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Unit</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400"
                      placeholder="MWh"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Data Hash</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400"
                      placeholder="0xabc..."
                      value={dataHash}
                      onChange={(e) => setDataHash(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Signer (email)</label>
                    <input
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400"
                      placeholder="auditor@example.com"
                      value={signer}
                      onChange={(e) => setSigner(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Button type="submit" className="btn-primary">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Submit Attestation
                    </Button>
                  </div>
                </form>
                {msg && (
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      {msg.includes("successfully") ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-white">{msg}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Compliance Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Compliance Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Regulatory Compliance</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Environmental Standards</span>
                      <span className="text-green-400">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Safety Protocols</span>
                      <span className="text-green-400">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data Integrity</span>
                      <span className="text-green-400">99.8%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Audit Checklist</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">KYC Verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">Environmental Compliance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">Safety Standards</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">Data Validation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">Next Review: 15 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Audit Reports</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Monthly Report</h4>
                    <p className="text-gray-400 text-sm mb-4">Comprehensive audit summary</p>
                    <Button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Compliance Report</h4>
                    <p className="text-gray-400 text-sm mb-4">Regulatory compliance analysis</p>
                    <Button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Performance Report</h4>
                    <p className="text-gray-400 text-sm mb-4">Audit performance metrics</p>
                    <Button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Audit Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Email Alerts</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">SMS Notifications</span>
                      <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Push Notifications</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Audit Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Auto-approval threshold</span>
                      <span className="text-white">$50,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Review period</span>
                      <span className="text-white">24 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Fraud detection</span>
                      <span className="text-green-400">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
