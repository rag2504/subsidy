import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthGate, { withAuthHeaders } from "@/components/auth/AuthGate";
import { getToken } from "@/lib/auth";
import { 
  DollarSign, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
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
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  FileText,
  ShieldCheck,
  FileCheck,
  ClipboardCheck,
  Users,
  Building,
  ArrowRight,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

export default function Bank() {
  const [queue, setQueue] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'payments' | 'compliance' | 'reports'>('overview');
  const [processedPayments, setProcessedPayments] = useState<any[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);

  const load = () =>
    fetch("/api/bank/queue", withAuthHeaders())
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setQueue(data);
        } else {
          console.error("API returned non-array data:", data);
          setQueue([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load queue:", error);
        setQueue([]);
      });

  useEffect(() => {
    if (getToken()) load();
  }, []);

  useEffect(() => {
    // Load mock data for enhanced dashboard
    setProcessedPayments([
      { id: 1, project: "PROJ-001", amount: "$100,000", status: "Completed", time: "2 hours ago", ref: "TXN-001" },
      { id: 2, project: "PROJ-045", amount: "$150,000", status: "Completed", time: "4 hours ago", ref: "TXN-002" },
      { id: 3, project: "PROJ-089", amount: "$75,000", status: "Pending", time: "6 hours ago", ref: "TXN-003" }
    ]);
    
    setFraudAlerts([
      { id: 1, type: "Suspicious Amount", severity: "Medium", time: "1 hour ago" },
      { id: 2, type: "Unusual Pattern", severity: "Low", time: "3 hours ago" }
    ]);
  }, []);

  // Mock data for enhanced dashboard
  const bankStats = {
    totalProcessed: "$2.4M",
    pendingAmount: "$450K",
    avgProcessingTime: "1.2 hours",
    successRate: "99.8%",
    fraudDetected: 2,
    complianceScore: "A+",
    dailyTransactions: 156,
    monthlyVolume: "$45.2M"
  };

  return (
    <AuthGate requiredRole="bank">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              <span className="text-gradient">Bank Operations Console</span>
            </h1>
            <p className="text-xl text-gray-300">
              Advanced payment processing with real-time fraud detection and regulatory compliance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="btn-secondary">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Alerts</span>
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">New Payment</span>
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <section className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Payment Overview</h2>
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
                  <p className="text-gray-400 text-sm">Total Processed</p>
                  <p className="text-2xl font-bold text-white">{bankStats.totalProcessed}</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">+15.2% this month</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pending Amount</p>
                  <p className="text-2xl font-bold text-white">{bankStats.pendingAmount}</p>
                </div>
              </div>
              <div className="text-yellow-400 text-sm font-medium">Requires attention</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{bankStats.successRate}</p>
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
                  <p className="text-gray-400 text-sm">Fraud Alerts</p>
                  <p className="text-2xl font-bold text-white">{bankStats.fraudDetected}</p>
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
              { id: 'queue', label: 'Payment Queue', icon: Clock },
              { id: 'payments', label: 'Processed', icon: CheckCircle },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'reports', label: 'Reports', icon: FileText }
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
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                  <div className="space-y-4">
                    {processedPayments.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          payment.status === 'Completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {payment.status === 'Completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{payment.project}</p>
                          <p className="text-sm text-gray-400">Ref: {payment.ref}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{payment.amount}</p>
                          <p className="text-xs text-gray-500">{payment.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Performance</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Processing Speed</span>
                        <span className="text-white">1.2 hours</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '95%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Success Rate</span>
                        <span className="text-white">99.8%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '99.8%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Compliance</span>
                      <span className="text-white">100%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Fraud Detection</span>
                        <span className="text-white">98.5%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '98.5%'}}></div>
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
                      <CreditCard className="w-4 h-4 mr-2" />
                      Process Payment
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Search Transactions
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button className="w-full btn-secondary justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Bank Settings
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Fraud Alerts</h3>
                  <div className="space-y-3">
                    {fraudAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div>
                          <p className="text-white font-medium text-sm">{alert.type}</p>
                          <p className="text-gray-400 text-xs">{alert.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Payment Queue</h3>
                <div className="flex items-center gap-2">
                  <Button className="btn-secondary" onClick={load}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button className="btn-secondary">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {queue.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Queue Empty</h3>
                    <p className="text-gray-400">No pending disbursements to process.</p>
                  </div>
                )}
                
                {queue.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg">
                            {d.projectId} • {d.milestoneKey}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Amount: {d.amount} • Rail: {d.rail}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                          Pending
                        </span>
                      </div>
                    </div>
                    <Approve id={d.id} onDone={load} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Processed Payments</h3>
              
              <div className="space-y-4">
                {processedPayments.map((payment) => (
                  <div key={payment.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          payment.status === 'Completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {payment.status === 'Completed' ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <Clock className="w-6 h-6 text-yellow-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg">{payment.project}</div>
                          <div className="text-gray-400 text-sm">Ref: {payment.ref}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium text-lg">{payment.amount}</div>
                        <div className="text-xs text-gray-500">{payment.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Compliance Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Regulatory Compliance</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">AML Compliance</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">KYC Verification</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transaction Monitoring</span>
                      <span className="text-green-400">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fraud Prevention</span>
                      <span className="text-green-400">98.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Compliance Checklist</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">AML Screening</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">KYC Verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">Transaction Limits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">Reporting Requirements</span>
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

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Bank Reports</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-center">
                    <Receipt className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Transaction Report</h4>
                    <p className="text-gray-400 text-sm mb-4">Daily transaction summary</p>
                    <Button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Compliance Report</h4>
                    <p className="text-gray-400 text-sm mb-4">Regulatory compliance summary</p>
                    <Button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Performance Report</h4>
                    <p className="text-gray-400 text-sm mb-4">Payment processing metrics</p>
                    <Button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
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

function Approve({ id, onDone }: { id: string; onDone: () => void }) {
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  
  return (
    <form
      className="flex items-center gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await fetch(
          "/api/bank/approve",
          withAuthHeaders({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, bankRef: ref }),
          }),
        );
        setBusy(false);
        onDone();
      }}
    >
      <div className="flex-1">
        <label className="text-sm text-gray-400 mb-1 block">Bank Reference</label>
        <input
          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400"
          placeholder="Enter bank reference"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={busy} className="btn-primary">
          {busy ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          {busy ? 'Processing...' : 'Approve'}
        </Button>
      </div>
    </form>
  );
}
