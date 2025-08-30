import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Globe, Shield, Factory, Search, Building2, Leaf } from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: <Leaf className="w-4 h-4" /> },
  { to: "/explorer", label: "Public Explorer", icon: <Globe className="w-4 h-4" /> },
  { to: "/gov", label: "Gov Admin", icon: <Shield className="w-4 h-4" /> },
  { to: "/producer", label: "Producer", icon: <Factory className="w-4 h-4" /> },
  { to: "/auditor", label: "Auditor", icon: <Search className="w-4 h-4" /> },
  { to: "/bank", label: "Bank Ops", icon: <Building2 className="w-4 h-4" /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 text-white">
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="container flex h-16 items-center justify-between px-4">
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
          
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105",
                  pathname === n.to
                    ? "bg-gradient-to-r from-primary/20 to-accent/20 text-white border border-white/20"
                    : "text-gray-300 hover:text-white",
                )}
              >
                {n.icon}
                {n.label}
              </Link>
            ))}
          </nav>
          
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl glass border border-white/20 hover:bg-white/10 transition-all duration-300"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {open && (
          <div className="md:hidden glass border-t border-white/10">
            <div className="container py-4 px-4">
              <div className="grid gap-2">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                      pathname === n.to
                        ? "bg-gradient-to-r from-primary/20 to-accent/20 text-white border border-white/20"
                        : "text-gray-300 hover:text-white hover:bg-white/10",
                    )}
                  >
                    {n.icon}
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="relative">
        {children}
      </main>
      
      <footer className="mt-20 glass border-t border-white/10">
        <div className="container py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Logo className="h-8 w-8" />
                <div>
                  <span className="text-xl font-black tracking-tight text-gradient">
                    GH₂ SubsidyFlow
                  </span>
                  <div className="text-sm text-gray-400">Transparent Energy Future</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Revolutionizing subsidy management through blockchain technology and smart contracts.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Platform</h3>
              <div className="space-y-2">
                <Link to="/explorer" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Public Explorer
                </Link>
                <Link to="/gov" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Government Dashboard
                </Link>
                <Link to="/producer" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Producer Portal
                </Link>
                <Link to="/auditor" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Auditor Console
                </Link>
              </div>
            </div>
            
            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Documentation
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  API Reference
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Security
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Compliance
                </a>
              </div>
            </div>
            
            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Contact</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Support
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Partnerships
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Press Kit
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © 2024 GH₂ SubsidyFlow. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
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
