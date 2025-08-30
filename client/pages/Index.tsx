import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Zap, 
  Eye, 
  TrendingUp, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Globe, 
  Database, 
  Code,
  BarChart3,
  Users,
  DollarSign,
  Leaf,
  Target,
  Clock,
  FileText,
  Smartphone,
  Monitor,
  Server,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10 space-y-32 pt-16">
        <Hero />
        <Highlights />
        <RoleGrid />
        <HowItWorks />
        <CTA />
      </div>
    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(164, 60%, 34%)" />
          <stop offset="50%" stopColor="hsl(192, 95%, 44%)" />
          <stop offset="100%" stopColor="hsl(221, 83%, 53%)" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#logoGradient)" filter="url(#logoGlow)" />
      <path
        d="M12 30c7 0 7-12 14-12 7 0 7 12 14 12"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="3.5" fill="white" />
      <text x="24" y="42" textAnchor="middle" className="text-xs font-bold fill-white">H₂</text>
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium text-cyan-100 mb-8 slide-in-up">
          <Leaf className="w-4 h-4" />
          HackOut'25: Green Hydrogen Subsidy Disbursement
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 slide-in-left">
          <span className="text-gradient-hero">GH₂ SubsidyFlow</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 mt-4">
            Automating Green Hydrogen Subsidy Disbursement with Smart Contracts
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 slide-in-right leading-relaxed">
          Revolutionizing subsidy management through blockchain technology. 
          Define programs & milestones, enroll projects, collect signed auditor 
          attestations, and release payments automatically — on-chain or via 
          legacy bank adaptor with complete transparency.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 slide-in-up">
          <Button asChild className="btn-primary text-lg px-10 py-4">
            <Link to="/explorer">
              <Globe className="w-5 h-5 mr-2" />
              Open Public Explorer
            </Link>
          </Button>
          <Button asChild className="btn-secondary text-lg px-10 py-4">
            <Link to="/gov">
              <Shield className="w-5 h-5 mr-2" />
              Gov Admin Dashboard
            </Link>
          </Button>
        </div>

        {/* Demo Info */}
        <div className="glass px-6 py-4 rounded-2xl inline-block slide-in-up">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-cyan-300">Demo Available:</span> 
            Use Project ID <code className="bg-white/10 px-2 py-1 rounded text-emerald-300">DEMO-PROJ-001</code> in the Explorer
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="mt-20 slide-in-up">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="glass-card p-8 rounded-3xl">
        <svg viewBox="0 0 800 400" className="w-full h-auto">
          <defs>
            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(164, 60%, 34%)" />
              <stop offset="50%" stopColor="hsl(192, 95%, 44%)" />
              <stop offset="100%" stopColor="hsl(221, 83%, 53%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background Grid */}
          <rect width="800" height="400" fill="url(#heroGradient)" opacity="0.1" rx="20"/>
          
          {/* Nodes */}
          {[
            { x: 100, y: 80, label: "Gov Admin", icon: "🏛️" },
            { x: 300, y: 80, label: "Producer", icon: "🏭" },
            { x: 500, y: 80, label: "Auditor", icon: "🔍" },
            { x: 700, y: 80, label: "Bank", icon: "🏦" },
            { x: 200, y: 280, label: "Smart Contract", icon: "⚡" },
            { x: 400, y: 280, label: "Blockchain", icon: "🔗" },
            { x: 600, y: 280, label: "Payment Rail", icon: "💳" },
          ].map((node, i) => (
            <g key={i} className="float" style={{ animationDelay: `${i * 0.5}s` }}>
              <circle
                cx={node.x}
                cy={node.y}
                r="40"
                fill="white"
                opacity="0.9"
                filter="url(#glow)"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="40"
                fill="none"
                stroke="hsl(164, 60%, 34%)"
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y - 10}
                textAnchor="middle"
                className="text-2xl"
              >
                {node.icon}
              </text>
              <text
                x={node.x}
                y={node.y + 25}
                textAnchor="middle"
                className="fill-slate-700 text-sm font-semibold"
              >
                {node.label}
              </text>
            </g>
          ))}
          
          {/* Connection Lines */}
          <path
            d="M140 120 Q400 200 260 240"
            stroke="hsl(192, 95%, 44%)"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M340 120 Q400 200 360 240"
            stroke="hsl(192, 95%, 44%)"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M540 120 Q400 200 440 240"
            stroke="hsl(192, 95%, 44%)"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M240 280 Q400 280 360 280"
            stroke="hsl(164, 60%, 34%)"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
            markerEnd="url(#arrowhead)"
          />
          
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(164, 60%, 34%)" />
            </marker>
          </defs>
          
          {/* Flow Text */}
          <text
            x="400"
            y="350"
            textAnchor="middle"
            className="fill-gray-400 text-sm font-medium"
          >
            EIP-712 Attestations → Smart Contract Validation → Automated Disbursements
          </text>
        </svg>
      </div>
    </div>
  );
}

function Highlights() {
  const items = [
    {
      title: "Automated Verification",
      desc: "AI-powered verification of production data and milestone completion with real-time validation.",
      icon: "⚡",
    },
    {
      title: "Milestone-based Disbursement",
      desc: "Smart contract-driven payments released automatically upon verified milestone completion.",
      icon: "🎯",
    },
    {
      title: "Transparency Dashboard",
      desc: "Public explorer with real-time visibility into all transactions and project status.",
      icon: "👁️",
    },
    {
      title: "Real-time Tracking",
      desc: "Live monitoring of subsidy flow, project progress, and payment status across the network.",
      icon: "📈",
    },
  ];
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Core Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Advanced blockchain technology meets government transparency requirements
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="feature-card">
              <div className="text-3xl mb-4">{it.icon}</div>
              <div className="text-xl font-bold text-white mb-3">{it.title}</div>
              <p className="text-gray-300">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleGrid() {
  const roles = [
    {
      role: "Gov Admin",
      to: "/gov",
      bullets: [
        "Create Program",
        "Approve Projects",
        "Define Milestones",
        "Release/Clawback",
      ],
      color: "bg-primary/10 text-primary",
    },
    {
      role: "Producer",
      to: "/producer",
      bullets: [
        "Apply Project",
        "View Milestones",
        "Receive Payouts",
        "Receipts",
      ],
      color: "bg-accent/20 text-foreground",
    },
    {
      role: "Auditor",
      to: "/auditor",
      bullets: ["Upload Proof", "EIP-712 Sign", "Submit Attestation"],
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      role: "Bank Ops",
      to: "/bank",
      bullets: ["Approve Payout", "Emit Webhook", "Finalize"],
      color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
    {
      role: "Public",
      to: "/explorer",
      bullets: ["Read-only Explorer", "Search ProjectID", "Timeline"],
      color: "bg-secondary text-secondary-foreground",
    },
  ];
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Dashboards
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Role-based access to platform functionality
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.role}
              to={r.to}
              className="feature-card group"
            >
              <div
                className={
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                  r.color
                }
              >
                {r.role}
              </div>
              <ul className="mt-3 space-y-1 text-sm text-gray-300">
                {r.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-medium text-primary">Open →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      t: "Gov Admin creates Program & Milestones",
      d: "Define milestone keys and payout amounts.",
    },
    {
      n: 2,
      t: "Producer applies & is approved",
      d: "Project is added to registry.",
    },
    {
      n: 3,
      t: "Auditor submits EIP-712 attestation",
      d: "Signer verified on-chain; Attested event emitted.",
    },
    {
      n: 4,
      t: "Payment released",
      d: "On-chain mock stablecoin or bank adaptor with webhook logs.",
    },
    {
      n: 5,
      t: "Public Explorer",
      d: "Transparent timeline with exportable audit trail.",
    },
  ];
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            How it works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Streamlined process ensuring transparency and efficiency
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="process-card text-sm">
              <div className="text-xs font-semibold text-gray-400 mb-2">
                Step {s.n}
              </div>
              <div className="font-semibold text-white mb-2">{s.t}</div>
              <div className="text-gray-300">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreFeatures() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automated Verification",
      description: "AI-powered verification of production data and milestone completion with real-time validation.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Milestone-based Disbursement",
      description: "Smart contract-driven payments released automatically upon verified milestone completion.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Transparency Dashboard",
      description: "Public explorer with real-time visibility into all transactions and project status.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Live monitoring of subsidy flow, project progress, and payment status across the network.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Fraud Prevention",
      description: "Multi-layer security with cryptographic signatures and blockchain immutability.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Compliance Assurance",
      description: "Built-in regulatory compliance with audit trails and exportable documentation.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Core Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Advanced blockchain technology meets government transparency requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessFlow() {
  const steps = [
    {
      number: "01",
      title: "Production Data Upload",
      description: "Producers upload verified production data and milestone evidence through secure channels.",
      icon: <FileText className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500"
    },
    {
      number: "02", 
      title: "Smart Contract Validation",
      description: "Automated verification of data integrity and milestone completion using blockchain consensus.",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "03",
      title: "Subsidy Release",
      description: "Instant payment disbursement via on-chain stablecoin or traditional banking rails.",
      icon: <DollarSign className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Process Flow
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Streamlined 3-step process ensuring transparency and efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="process-card group">
              {/* Step Number */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                {step.number}
              </div>
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
              
              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const metrics = [
    { label: "Total Subsidy Released", value: "$2.4B", icon: <DollarSign className="w-5 h-5" />, change: "+12.5%" },
    { label: "Projects Onboarded", value: "1,247", icon: <Users className="w-5 h-5" />, change: "+8.3%" },
    { label: "GH₂ Volume Verified", value: "45.2M kg", icon: <Leaf className="w-5 h-5" />, change: "+15.7%" },
    { label: "Success Rate", value: "99.8%", icon: <CheckCircle className="w-5 h-5" />, change: "+0.2%" }
  ];

  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Dashboard Preview
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Real-time insights into subsidy distribution and project performance
          </p>
        </div>

        <div className="dashboard-preview">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">GH₂ SubsidyFlow Analytics</h3>
              <p className="text-gray-400">Live dashboard • Updated every 30 seconds</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div key={metric.label} className="metric-item group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                </div>
                <div className="text-green-400 text-sm font-medium">
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <p className="text-gray-400">Interactive Analytics Dashboard</p>
              <p className="text-sm text-gray-500">Real-time charts and visualizations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyItMatters() {
  const reasons = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Climate Goals",
      description: "Accelerating the transition to green hydrogen production to meet global climate targets.",
      stat: "50% reduction in CO₂ emissions by 2030"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Renewable Energy",
      description: "Supporting the growth of renewable energy infrastructure and sustainable practices.",
      stat: "100% renewable energy integration"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparent Governance",
      description: "Ensuring accountability and transparency in government subsidy distribution.",
      stat: "100% audit trail visibility"
    }
  ];

  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Why It Matters
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Building a sustainable future through transparent, efficient subsidy management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={reason.title} className="feature-card text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{reason.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{reason.description}</p>
              <div className="glass px-4 py-2 rounded-full inline-block">
                <span className="text-primary font-semibold">{reason.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const technologies = [
    { name: "Ethereum Smart Contracts", icon: <Code className="w-5 h-5" />, color: "from-purple-500 to-pink-500" },
    { name: "Node.js Backend", icon: <Server className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { name: "Government APIs", icon: <Database className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
    { name: "React Frontend", icon: <Monitor className="w-5 h-5" />, color: "from-cyan-500 to-blue-500" },
    { name: "Blockchain Security", icon: <Lock className="w-5 h-5" />, color: "from-orange-500 to-red-500" },
    { name: "Real-time Analytics", icon: <BarChart3 className="w-5 h-5" />, color: "from-indigo-500 to-purple-500" }
  ];

  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Technology Stack
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto slide-in-up">
            Cutting-edge technologies powering the future of subsidy management
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {technologies.map((tech) => (
              <div key={tech.name} className="tech-badge group">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${tech.color} flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <span className="text-white text-xs font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-card p-12 rounded-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-up">
            Join GH₂ SubsidyFlow
          </h2>
          <p className="text-xl text-gray-300 mb-8 slide-in-up">
            Build a transparent energy future with blockchain-powered subsidy management
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 slide-in-up">
            <Button asChild className="btn-primary text-lg px-10 py-4">
              <Link to="/explorer">
                <Globe className="w-5 h-5 mr-2" />
                Explore Platform
              </Link>
            </Button>
            <Button asChild className="btn-secondary text-lg px-10 py-4">
              <Link to="/gov">
                <Shield className="w-5 h-5 mr-2" />
                Access Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-400 slide-in-up">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Government Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>100% Transparent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
