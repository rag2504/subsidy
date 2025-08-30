import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="space-y-20">
      <Hero />
      <Highlights />
      <RoleGrid />
      <HowItWorks />
      <CTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="grid gap-10 md:grid-cols-2 md:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          HackOut’25: Green Hydrogen Subsidy Disbursement
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
          GH₂ SubsidyFlow
          <span className="block text-foreground/80">
            Smart-contract-based Subsidy Disbursement
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Define programs & milestones, enroll projects, collect signed auditor
          attestations, and release payments automatically — on-chain (mock
          stablecoin) or via a legacy bank adaptor with webhook confirmation.
          Includes a public audit explorer.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild className="px-5">
            <Link to="/explorer">Open Public Explorer</Link>
          </Button>
          <Button variant="secondary" asChild className="px-5">
            <Link to="/gov">Gov Admin Dashboard</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Seeded demo: 1 program, 1 project, 2 milestones. Use Project ID
          DEMO-PROJ-001 in the Explorer.
        </p>
      </div>
      <Diagram />
    </section>
  );
}

function Diagram() {
  return (
    <div className="relative rounded-2xl border bg-card p-6 shadow-sm">
      <svg viewBox="0 0 600 360" className="w-full" aria-hidden>
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        <rect
          x="10"
          y="10"
          width="580"
          height="340"
          rx="16"
          fill="url(#g2)"
          opacity="0.08"
        />
        {[
          { x: 60, y: 70, t: "Gov Admin" },
          { x: 250, y: 70, t: "Producer" },
          { x: 440, y: 70, t: "Auditor" },
          { x: 150, y: 240, t: "Smart Contract" },
          { x: 380, y: 240, t: "Bank Adaptor" },
        ].map((n, i) => (
          <g key={i}>
            <rect
              x={n.x - 60}
              y={n.y - 28}
              width="120"
              height="56"
              rx="12"
              fill="white"
              opacity="0.9"
            />
            <rect
              x={n.x - 60}
              y={n.y - 28}
              width="120"
              height="56"
              rx="12"
              fill="none"
              stroke="hsl(var(--border))"
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              className="fill-foreground"
              style={{ font: "600 12px Inter, ui-sans-serif" }}
            >
              {n.t}
            </text>
          </g>
        ))}
        <path
          d="M90 98 C160 160, 160 160, 180 212"
          stroke="hsl(var(--ring))"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M280 98 C230 160, 230 160, 200 212"
          stroke="hsl(var(--ring))"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M460 98 C420 160, 420 160, 400 212"
          stroke="hsl(var(--ring))"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M220 240 C280 240, 300 240, 340 240"
          stroke="hsl(var(--ring))"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="2"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,4 L4,2 z" fill="hsl(var(--ring))" />
          </marker>
        </defs>
        <text
          x="300"
          y="330"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ font: "500 12px Inter, ui-sans-serif" }}
        >
          Attestations (EIP-712) → Verified → Disbursements (on-chain/bank)
        </text>
      </svg>
    </div>
  );
}

function Highlights() {
  const items = [
    {
      title: "Roles & Guards",
      desc: "Whitelisted GOV/AUDITOR/BANK roles with JWT auth and route-level permissions.",
      icon: "🔐",
    },
    {
      title: "Milestones",
      desc: "Define, attest (EIP-712), and release payments once per milestone with events.",
      icon: "📏",
    },
    {
      title: "Dual Rails",
      desc: "Mock stablecoin on-chain or legacy bank adaptor with webhook confirmation.",
      icon: "🏦",
    },
    {
      title: "Auditability",
      desc: "Store dataHash, bankRef/Tx, timestamps, and export CSV/JSON.",
      icon: "🧾",
    },
  ];
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {items.map((it) => (
        <div key={it.title} className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="text-2xl">{it.icon}</div>
          <div className="mt-3 font-semibold">{it.title}</div>
          <p className="text-sm text-muted-foreground">{it.desc}</p>
        </div>
      ))}
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
    <section>
      <h2 className="text-xl font-bold">Dashboards</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {roles.map((r) => (
          <Link
            key={r.role}
            to={r.to}
            className="group rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            <div
              className={
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                r.color
              }
            >
              {r.role}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
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
    <section>
      <h2 className="text-xl font-bold">How it works</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-5">
        {steps.map((s) => (
          <div key={s.n} className="rounded-xl border bg-card p-5 text-sm">
            <div className="text-xs font-semibold text-muted-foreground">
              Step {s.n}
            </div>
            <div className="mt-1 font-semibold">{s.t}</div>
            <div className="mt-1 text-muted-foreground">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-accent/10 to-transparent p-8 text-center shadow-sm">
      <h3 className="text-2xl font-bold">Ready to explore the audit trail?</h3>
      <p className="mt-2 text-muted-foreground">
        Start with the demo Project ID in the Public Explorer or jump into the
        role-based consoles.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="px-5">
          <Link to="/explorer">Open Explorer</Link>
        </Button>
        <Button asChild variant="secondary" className="px-5">
          <Link to="/gov">Open Gov Admin</Link>
        </Button>
      </div>
    </section>
  );
}
