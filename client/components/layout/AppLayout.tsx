import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/explorer", label: "Public Explorer" },
  { to: "/gov", label: "Gov Admin" },
  { to: "/producer", label: "Producer" },
  { to: "/auditor", label: "Auditor" },
  { to: "/bank", label: "Bank Ops" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="text-lg font-extrabold tracking-tight">GH₂ SubsidyFlow</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === n.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/70 hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
            </div>
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background">
            <div className="container py-2">
              <div className="grid gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium",
                      pathname === n.to
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                    )}
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="container py-10">{children}</main>
      <footer className="mt-10 border-t border-border/60 bg-background/60">
        <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <span>GH₂ SubsidyFlow</span>
          </div>
          <div className="flex gap-4">
            <Link to="/explorer" className="hover:text-foreground">Audit Explorer</Link>
            <a href="https://builder.io/c/docs/projects" target="_blank" rel="noreferrer" className="hover:text-foreground">Docs</a>
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
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="9" fill="url(#g)" />
      <path d="M12 30c7 0 7-12 14-12 7 0 7 12 14 12" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3.5" fill="hsl(var(--primary-foreground))" />
    </svg>
  );
}
