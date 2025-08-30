import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Zap, 
  Globe, 
  Database,
  TrendingUp,
  Activity,
  Leaf,
  Award,
  Target,
  Clock,
  BarChart3,
  Users,
  Building,
  Lock,
  Eye,
  Download,
  Play,
  Pause,
  Upload
} from "lucide-react";
import DynamicDashboard from "@/components/dynamic/DynamicDashboard";

// Logo component
function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDynamicDashboard, setShowDynamicDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Logo className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:bg-primary/30 transition-colors duration-300"></div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-gradient">
                  GH₂ SubsidyFlow
                </span>
                <div className="text-xs text-gray-400 font-medium">Blockchain-Powered Subsidy Management</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/explorer" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Explorer
              </Link>
              <Link to="/gov" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Gov Admin
              </Link>
              <Link to="/producer" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Producer
              </Link>
              <Link to="/auditor" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Auditor
              </Link>
              <Link to="/bank" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Bank Ops
              </Link>
              <button
                onClick={() => setShowDynamicDashboard(!showDynamicDashboard)}
                className="btn-primary text-sm"
              >
                {showDynamicDashboard ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Static View
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Live Dashboard
                  </>
                )}
              </button>
            </div>

            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl glass border border-white/20 hover:bg-white/10 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              <Link to="/explorer" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">
                Explorer
              </Link>
              <Link to="/gov" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">
                Gov Admin
              </Link>
              <Link to="/producer" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">
                Producer
              </Link>
              <Link to="/auditor" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">
                Auditor
              </Link>
              <Link to="/bank" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">
                Bank Ops
              </Link>
              <button
                onClick={() => setShowDynamicDashboard(!showDynamicDashboard)}
                className="w-full btn-primary text-sm mt-4"
              >
                {showDynamicDashboard ? 'Static View' : 'Live Dashboard'}
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10 space-y-32 pt-16">
        {showDynamicDashboard ? (
          <DynamicDashboard />
        ) : (
          <>
            <Hero />
            <Highlights />
            <RoleGrid />
            <HowItWorks />
            <CTA />
          </>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
          <span className="text-gradient-hero">
            Automating Green Hydrogen
            <br />
            Subsidy Disbursement
          </span>
          <br />
          <span className="text-white">
            with Smart Contracts
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
          Revolutionizing subsidy management through blockchain technology, 
          ensuring transparency, efficiency, and trust in green hydrogen production.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/explorer" className="btn-primary text-lg px-8 py-4">
            Explore Platform
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <button className="btn-secondary text-lg px-8 py-4">
            <Download className="w-5 h-5 mr-2" />
            Download Whitepaper
          </button>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Automated Verification",
      description: "Smart contracts auto-verify hydrogen production data before releasing subsidies."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Milestone-based Disbursement",
      description: "Funds released automatically upon achievement of predefined milestones."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Transparency Dashboard",
      description: "Real-time visibility into all subsidy transactions and project progress."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Live monitoring of production metrics and subsidy distribution."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Fraud Prevention",
      description: "Advanced AI-powered fraud detection and prevention mechanisms."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-gradient">Core Platform Features</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Advanced capabilities designed for the future of sustainable energy subsidy management
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="feature-card group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoleGrid() {
  const roles = [
    {
      icon: <Building className="w-8 h-8" />,
      title: "Government Officials",
      description: "Manage subsidy programs, approve disbursements, and monitor compliance.",
      link: "/gov",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hydrogen Producers",
      description: "Submit production data, track milestones, and receive subsidies.",
      link: "/producer",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Auditors",
      description: "Verify compliance, validate data, and ensure regulatory adherence.",
      link: "/auditor",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Bank Operations",
      description: "Process payments, manage transactions, and ensure financial compliance.",
      link: "/bank",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-gradient">Role-Based Access</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Tailored dashboards and workflows for different stakeholders in the subsidy ecosystem
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((role, index) => (
          <Link key={index} to={role.link} className="group">
            <div className="glass-card p-8 rounded-3xl hover-lift">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${role.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {role.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{role.title}</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{role.description}</p>
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Access Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Production Data Upload",
      description: "Producers submit real-time hydrogen production data through IoT sensors and manual inputs.",
      icon: <Upload className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Smart Contract Validation",
      description: "Blockchain smart contracts automatically verify data authenticity and milestone achievement.",
      icon: <CheckCircle className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Subsidy Release",
      description: "Funds are automatically disbursed to verified producers upon successful validation.",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-gradient">How It Works</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          A streamlined 3-step process that ensures efficiency and transparency
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="process-card group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="text-6xl font-black text-white/10 mb-4">{step.number}</div>
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card p-12 rounded-3xl text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-gradient">Join GH₂ SubsidyFlow</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Build a transparent energy future with blockchain-powered subsidy management
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/explorer" className="btn-primary text-lg px-8 py-4">
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <button className="btn-secondary text-lg px-8 py-4">
            <Globe className="w-5 h-5 mr-2" />
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
