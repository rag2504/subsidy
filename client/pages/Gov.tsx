import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";
import { getToken } from "@/lib/auth";
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  BarChart3,
  Calculator,
  Eye,
  Download,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Activity,
  Award,
  Target,
  Zap,
  Database,
  Globe,
  Lock,
  UserCheck,
  FileText,
  PieChart,
  LineChart
} from "lucide-react";

export default function Gov() {
  return (
    <AuthGate requiredRole="gov">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              <span className="text-gradient">Government Admin Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300">
              Advanced subsidy management with AI-powered fraud detection and real-time analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="btn-secondary">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Program
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <AnalyticsOverview />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Programs />
            <PendingProjects />
            <FraudDetection />
          </div>
          <div className="space-y-8">
            <QuickActions />
            <RecentActivity />
            <KYCStatus />
          </div>
        </div>

        <Milestones />
        <Release />
        <Governance />
      </div>
    </AuthGate>
  );
}

function AnalyticsOverview() {
  const metrics = {
    totalSubsidy: "$2.4B",
    activePrograms: 24,
    pendingApprovals: 156,
    fraudAlerts: 3,
    avgProcessingTime: "1.2 days",
    successRate: "99.8%",
    totalProjects: 1247,
    carbonCredits: "45.2M kg"
  };

  return (
    <section className="glass-card p-8 rounded-3xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Platform Overview</h2>
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
              <p className="text-2xl font-bold text-white">{metrics.totalSubsidy}</p>
            </div>
          </div>
          <div className="text-green-400 text-sm font-medium">+12.5% this month</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Programs</p>
              <p className="text-2xl font-bold text-white">{metrics.activePrograms}</p>
            </div>
          </div>
          <div className="text-green-400 text-sm font-medium">+2 new this week</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Fraud Alerts</p>
              <p className="text-2xl font-bold text-white">{metrics.fraudAlerts}</p>
            </div>
          </div>
          <div className="text-red-400 text-sm font-medium">Requires attention</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">{metrics.successRate}</p>
            </div>
          </div>
          <div className="text-green-400 text-sm font-medium">+0.2% this month</div>
        </div>
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <section className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button className="w-full btn-secondary justify-start">
          <Calculator className="w-4 h-4 mr-2" />
          Subsidy Calculator
        </Button>
        <Button className="w-full btn-secondary justify-start">
          <UserCheck className="w-4 h-4 mr-2" />
          KYC Verification
        </Button>
        <Button className="w-full btn-secondary justify-start">
          <Shield className="w-4 h-4 mr-2" />
          Fraud Review
        </Button>
        <Button className="w-full btn-secondary justify-start">
          <Download className="w-4 h-4 mr-2" />
          Export Reports
        </Button>
        <Button className="w-full btn-secondary justify-start">
          <Settings className="w-4 h-4 mr-2" />
          System Settings
        </Button>
      </div>
    </section>
  );
}

function RecentActivity() {
  const activities = [
    { action: "New project approved", time: "2 min ago", type: "success" },
    { action: "Fraud alert detected", time: "15 min ago", type: "warning" },
    { action: "Subsidy disbursed", time: "1 hour ago", type: "info" },
    { action: "KYC verification completed", time: "2 hours ago", type: "success" },
    { action: "Milestone updated", time: "3 hours ago", type: "info" }
  ];

  return (
    <section className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className={`w-2 h-2 rounded-full ${
              activity.type === 'success' ? 'bg-green-500' :
              activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm text-white">{activity.action}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function KYCStatus() {
  const kycStats = {
    total: 1247,
    verified: 1189,
    pending: 45,
    rejected: 13
  };

  return (
    <section className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">KYC Status</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Verified</span>
          <span className="text-green-400 font-medium">{kycStats.verified}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{width: `${(kycStats.verified/kycStats.total)*100}%`}}></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Pending</span>
          <span className="text-yellow-400 font-medium">{kycStats.pending}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(kycStats.pending/kycStats.total)*100}%`}}></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Rejected</span>
          <span className="text-red-400 font-medium">{kycStats.rejected}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-red-500 h-2 rounded-full" style={{width: `${(kycStats.rejected/kycStats.total)*100}%`}}></div>
        </div>
      </div>
    </section>
  );
}

function FraudDetection() {
  const fraudAlerts = [
    { id: 1, project: "PROJ-001", type: "Suspicious Activity", severity: "High", time: "15 min ago" },
    { id: 2, project: "PROJ-045", type: "Data Anomaly", severity: "Medium", time: "2 hours ago" },
    { id: 3, project: "PROJ-089", type: "Duplicate Claim", severity: "Low", time: "1 day ago" }
  ];

  return (
    <section className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Fraud Detection Alerts</h3>
        <Button className="btn-secondary">
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {fraudAlerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                alert.severity === 'High' ? 'bg-red-500' :
                alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div>
                <p className="text-white font-medium">{alert.project}</p>
                <p className="text-sm text-gray-400">{alert.type}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                alert.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                alert.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {alert.severity}
              </span>
              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Programs() {
  const [name, setName] = useState("Green H₂ Pilot 2025");
  const [programs, setPrograms] = useState<any[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    hydrogenVolume: "",
    purityLevel: "",
    sustainabilityScore: "",
    carbonIntensity: ""
  });

  const load = () =>
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
        } else {
          console.error("API returned non-array data:", data);
          setPrograms([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load programs:", error);
        setPrograms([]);
      });
  useEffect(() => {
    load();
  }, []);

  const calculateSubsidy = () => {
    const volume = parseFloat(calculatorData.hydrogenVolume) || 0;
    const purity = parseFloat(calculatorData.purityLevel) || 0;
    const sustainability = parseFloat(calculatorData.sustainabilityScore) || 0;
    const carbonIntensity = parseFloat(calculatorData.carbonIntensity) || 0;
    
    // Complex subsidy calculation algorithm
    const baseRate = 50; // $50 per kg
    const purityBonus = (purity - 95) * 2; // Bonus for high purity
    const sustainabilityBonus = sustainability * 10; // Bonus for sustainability
    const carbonPenalty = carbonIntensity * 5; // Penalty for high carbon intensity
    
    const totalSubsidy = volume * (baseRate + purityBonus + sustainabilityBonus - carbonPenalty);
    
    return Math.max(0, totalSubsidy);
  };

  return (
    <section className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Programs</h2>
        <Button onClick={() => setShowCalculator(!showCalculator)} className="btn-secondary">
          <Calculator className="w-4 h-4 mr-2" />
          Subsidy Calculator
        </Button>
      </div>

      {showCalculator && (
        <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Dynamic Subsidy Calculator</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Hydrogen Volume (kg)</label>
              <input
                type="number"
                value={calculatorData.hydrogenVolume}
                onChange={(e) => setCalculatorData({...calculatorData, hydrogenVolume: e.target.value})}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Purity Level (%)</label>
              <input
                type="number"
                value={calculatorData.purityLevel}
                onChange={(e) => setCalculatorData({...calculatorData, purityLevel: e.target.value})}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                placeholder="99.5"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Sustainability Score</label>
              <input
                type="number"
                value={calculatorData.sustainabilityScore}
                onChange={(e) => setCalculatorData({...calculatorData, sustainabilityScore: e.target.value})}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                placeholder="8.5"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Carbon Intensity (kg CO₂/kg H₂)</label>
              <input
                type="number"
                value={calculatorData.carbonIntensity}
                onChange={(e) => setCalculatorData({...calculatorData, carbonIntensity: e.target.value})}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                placeholder="2.5"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              Estimated Subsidy: ${calculateSubsidy().toLocaleString()}
            </div>
            <p className="text-sm text-gray-400">
              Based on volume, purity, sustainability, and carbon intensity
            </p>
          </div>
        </div>
      )}

      <form
        className="flex gap-2 mb-6"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch(
            "/api/gov/programs",
            withAuthHeaders({
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            }),
          );
          setName("");
          load();
        }}
      >
        <input
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Program name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" className="btn-primary">Create</Button>
      </form>
      
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((p) => (
          <div key={p.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-white">{p.name}</div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="btn-secondary">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" className="btn-secondary">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-400">ID: {p.id}</div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="text-green-400">Active</span>
              <span className="text-gray-400">• 15 projects</span>
              <span className="text-gray-400">• $2.4M disbursed</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PendingProjects() {
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  
  const load = () =>
    fetch("/api/gov/projects?status=pending", withAuthHeaders())
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setList(data);
        } else {
          console.error("API returned non-array data:", data);
          setList([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load pending projects:", error);
        setList([]);
      });
  useEffect(() => {
    if (getToken()) load();
  }, []);

  return (
    <section className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Pending Projects</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white text-sm"
          >
            <option value="all">All</option>
            <option value="high-priority">High Priority</option>
            <option value="kyc-pending">KYC Pending</option>
            <option value="fraud-review">Fraud Review</option>
          </select>
        </div>
      </div>
      
      {list.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No pending projects.
        </div>
      )}
      
      <div className="space-y-4">
        {list.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">
                  {p.name} <span className="text-gray-400">({p.id})</span>
                </div>
                <div className="text-sm text-gray-400">Program: {p.program}</div>
                <div className="flex items-center gap-4 mt-1 text-xs">
                  <span className="text-yellow-400">KYC Pending</span>
                  <span className="text-gray-400">• Submitted 2 days ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="btn-secondary">
                <Eye className="w-4 h-4 mr-1" />
                Review
              </Button>
              <Button
                size="sm"
                className="btn-primary"
                onClick={async () => {
                  await fetch(
                    `/api/gov/projects/${p.id}/approve`,
                    withAuthHeaders({ method: "POST" }),
                  );
                  load();
                }}
              >
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
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
    if (programId)
      fetch(`/api/gov/milestones?programId=${programId}`)
        .then((r) => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setList(data);
          } else {
            console.error("API returned non-array data:", data);
            setList([]);
          }
        })
        .catch((error) => {
          console.error("Failed to load milestones:", error);
          setList([]);
        });
  }, [programId]);

  return (
    <section className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-6">Milestones</h2>
      <form
        className="grid gap-4 md:grid-cols-5 mb-6"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch(
            "/api/gov/milestones",
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
          setKey("");
          setTitle("");
          setAmount("");
          fetch(`/api/gov/milestones?programId=${programId}`)
            .then((r) => {
              if (!r.ok) {
                throw new Error(`HTTP error! status: ${r.status}`);
              }
              return r.json();
            })
            .then((data) => {
              if (Array.isArray(data)) {
                setList(data);
              } else {
                console.error("API returned non-array data:", data);
                setList([]);
              }
            })
            .catch((error) => {
              console.error("Failed to load milestones:", error);
              setList([]);
            });
        }}
      >
        <select
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
        >
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Key (e.g., M1)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <div className="md:col-span-5">
          <Button type="submit" className="btn-primary">Add Milestone</Button>
        </div>
      </form>
      
      <div className="grid gap-4 md:grid-cols-3">
        {list.map((m) => (
          <div key={m.key} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-white">
                {m.key}: {m.title}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="btn-secondary">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" className="btn-secondary">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {m.amount} {m.unit}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="text-green-400">Active</span>
              <span className="text-gray-400">• 5 projects</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Release() {
  const [projectId, setProjectId] = useState("DEMO-PROJ-001");
  const [milestoneKey, setMilestoneKey] = useState("M1");
  const [amount, setAmount] = useState("10000");
  const [rail, setRail] = useState("bank");
  const [msg, setMsg] = useState<string | null>(null);
  
  return (
    <section className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-6">Trigger Release</h2>
      <form
        className="grid gap-4 md:grid-cols-5 mb-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setMsg(null);
          const r = await fetch(
            "/api/gov/release",
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
          setMsg(r.ok ? "Queued for bank" : "Error");
        }}
      >
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Milestone Key"
          value={milestoneKey}
          onChange={(e) => setMilestoneKey(e.target.value)}
        />
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          value={rail}
          onChange={(e) => setRail(e.target.value)}
        >
          <option value="bank">Bank</option>
          <option value="onchain">On-chain (mock)</option>
        </select>
        <Button type="submit" className="btn-primary">Queue</Button>
      </form>
      {msg && <div className="text-sm text-gray-400">{msg}</div>}
    </section>
  );
}

function Governance() {
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  
  return (
    <section className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-6">Revoke / Clawback</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <Button
          className="btn-secondary"
          onClick={async () => {
            await fetch(
              "/api/gov/revoke",
              withAuthHeaders({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, reason: "policy" }),
              }),
            );
          }}
        >
          Revoke
        </Button>
        <div />
        <input
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Clawback Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          className="btn-secondary"
          onClick={async () => {
            await fetch(
              "/api/gov/clawback",
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
          }}
        >
          Clawback
        </Button>
      </div>
    </section>
  );
}
