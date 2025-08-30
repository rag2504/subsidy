import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";
import { 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  Shield, 
  BarChart3, 
  Plus, 
  Upload, 
  Bell,
  Award,
  Target,
  Zap,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Settings,
  Smartphone,
  Wifi,
  Database,
  FileText,
  PieChart,
  LineChart,
  Calendar,
  Thermometer,
  Gauge
} from "lucide-react";

export default function Producer() {
  const [name, setName] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [programId, setProgramId] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'data' | 'analytics' | 'compliance'>('overview');

  useEffect(() => {
    fetch("/api/gov/programs")
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPrograms(data);
          if (data[0]) setProgramId(data[0].id);
        } else {
          console.error("API returned non-array data:", data);
          setPrograms([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load programs:", error);
        setPrograms([]);
      });
  }, []);

  useEffect(() => {
    // Load projects after login (OTP-based token present)
    fetch("/api/producer/projects", withAuthHeaders())
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("API returned non-array data:", data);
          setProjects([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load projects:", error);
        setProjects([]);
      });
  }, []);

  // Mock data for enhanced dashboard
  const producerStats = {
    totalSubsidy: "$450,000",
    carbonCredits: "12,450 kg",
    trustScore: "A+",
    complianceRate: "98.5%",
    activeProjects: 3,
    pendingMilestones: 2,
    nextDisbursement: "$100,000",
    avgEfficiency: "94.2%"
  };

  return (
    <AuthGate requiredRole="producer">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              <span className="text-gradient">Producer Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300">
              Real-time production tracking with AI-powered insights and mobile-first access
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="btn-secondary">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </Button>
            <Button className="btn-primary">
              <Smartphone className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Mobile App</span>
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <section className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Production Overview</h2>
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
                  <p className="text-2xl font-bold text-white">{producerStats.totalSubsidy}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+15.2% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Carbon Credits</p>
                  <p className="text-2xl font-bold text-white">{producerStats.carbonCredits}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+8.7% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Trust Score</p>
                  <p className="text-2xl font-bold text-white">{producerStats.trustScore}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+0.3 this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Efficiency</p>
                  <p className="text-2xl font-bold text-white">{producerStats.avgEfficiency}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+2.1% this month</div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="glass-card p-6 rounded-2xl">
          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'projects', label: 'Projects', icon: Target },
              { id: 'data', label: 'Data Upload', icon: Upload },
              { id: 'analytics', label: 'Analytics', icon: LineChart },
              { id: 'compliance', label: 'Compliance', icon: Shield }
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
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Milestone M3 completed</p>
                        <p className="text-sm text-gray-400">$100,000 subsidy released</p>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Daily data uploaded</p>
                        <p className="text-sm text-gray-400">1,250 kWh produced</p>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Trust score increased</p>
                        <p className="text-sm text-gray-400">A+ rating achieved</p>
                      </div>
                      <span className="text-xs text-gray-500">3 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">IoT Sensor Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <Thermometer className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Temperature</p>
                      <p className="text-sm text-gray-400">42°C</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Gauge className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Pressure</p>
                      <p className="text-sm text-gray-400">2.4 bar</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Power</p>
                      <p className="text-sm text-gray-400">1.2 MW</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Efficiency</p>
                      <p className="text-sm text-gray-400">94.2%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full btn-secondary justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Data
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      View Reports
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Next Milestone</h3>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium mb-2">Milestone M4</p>
                    <p className="text-gray-400 text-sm mb-4">15,000 kWh Production</p>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                      <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-sm text-gray-400">75% Complete</p>
                    <p className="text-primary font-medium mt-2">$150,000 pending</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">My Projects</h3>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              <form 
                className="glass-card p-6 rounded-xl border border-white/10"
                onSubmit={async (e) => {
                  e.preventDefault(); 
                  const r = await fetch("/api/producer/projects/create", withAuthHeaders({ 
                    method: "POST", 
                    headers: {"Content-Type": "application/json"}, 
                    body: JSON.stringify({ name }) 
                  })); 
                  const d = await r.json(); 
                  setProjects((p) => [...p, d]); 
                  setName(""); 
                }}
              >
                <h4 className="text-white font-medium mb-4">Create New Project</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <input 
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400" 
                    placeholder="Project name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                  <select 
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white" 
                    value={programId} 
                    onChange={(e) => setProgramId(e.target.value)}
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <Button type="submit" className="btn-primary">Create Project</Button>
                </div>
              </form>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <div key={p.id || p.projectId} className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-2">{p.name}</h4>
                    <p className="text-sm text-gray-400 mb-4">ID: {p.id || p.projectId}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Subsidy</span>
                        <span className="text-white">$450,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Carbon Credits</span>
                        <span className="text-white">12,450 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Milestones</span>
                        <span className="text-white">3/5 Complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Data Upload</h3>
                <div className="flex items-center gap-2">
                  <Button className="btn-secondary">
                    <Wifi className="w-4 h-4 mr-2" />
                    IoT Sync
                  </Button>
                  <Button className="btn-secondary">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <h4 className="text-white font-medium mb-4">Daily Production Data</h4>
                  <DailyDataForm />
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <h4 className="text-white font-medium mb-4">IoT Integration</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Sensor Network</p>
                          <p className="text-sm text-gray-400">12 sensors connected</p>
                        </div>
                      </div>
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Data Pipeline</p>
                          <p className="text-sm text-gray-400">Real-time processing</p>
                        </div>
                      </div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-white font-medium">Security</p>
                          <p className="text-sm text-gray-400">Encrypted transmission</p>
                        </div>
                      </div>
                      <span className="text-green-400 text-sm">Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Production Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Production Trends</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">This Week</span>
                        <span className="text-white">8,750 kWh</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">This Month</span>
                        <span className="text-white">32,450 kWh</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Efficiency</span>
                        <span className="text-white">94.2%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Carbon Impact</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">CO₂ Avoided</span>
                      <span className="text-green-400 font-medium">12,450 kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Carbon Credits</span>
                      <span className="text-blue-400 font-medium">12,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Market Value</span>
                      <span className="text-white font-medium">$24,900</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Equivalent Trees</span>
                      <span className="text-emerald-400 font-medium">623</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Compliance & Trust Score</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">A+</h4>
                    <p className="text-gray-400">Trust Score</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data Accuracy</span>
                      <span className="text-green-400">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timeline Compliance</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality Standards</span>
                      <span className="text-green-400">A+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Audit Score</span>
                      <span className="text-green-400">95.2%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Compliance Checklist</h4>
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
                      <span className="text-white">Data Reporting</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">Quality Assurance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">Next Audit: 30 days</span>
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

function DailyDataForm() {
  const [projectId, setProjectId] = useState("");
  const [kwh, setKwh] = useState("");
  const [purity, setPurity] = useState("");
  const [temperature, setTemperature] = useState("");
  const [pressure, setPressure] = useState("");

  return (
    <form 
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault(); 
        await fetch("/api/producer/data", withAuthHeaders({ 
          method: "POST", 
          headers: {"Content-Type": "application/json"}, 
          body: JSON.stringify({ 
            projectId, 
            kwh: Number(kwh),
            purity: Number(purity),
            temperature: Number(temperature),
            pressure: Number(pressure)
          }) 
        })); 
        setKwh(""); 
        setPurity("");
        setTemperature("");
        setPressure("");
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input 
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400" 
          placeholder="Project ID" 
          value={projectId} 
          onChange={(e) => setProjectId(e.target.value)} 
        />
        <input 
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400" 
          placeholder="kWh produced" 
          value={kwh} 
          onChange={(e) => setKwh(e.target.value)} 
        />
        <input 
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400" 
          placeholder="Purity level (%)" 
          value={purity} 
          onChange={(e) => setPurity(e.target.value)} 
        />
        <input 
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400" 
          placeholder="Temperature (°C)" 
          value={temperature} 
          onChange={(e) => setTemperature(e.target.value)} 
        />
        <input 
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400" 
          placeholder="Pressure (bar)" 
          value={pressure} 
          onChange={(e) => setPressure(e.target.value)} 
        />
        <Button type="submit" className="btn-primary">
          <Upload className="w-4 h-4 mr-2" />
          Submit Data
        </Button>
      </div>
    </form>
  );
}
