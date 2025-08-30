import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { requestOtp, verifyOtp, me, staticLogin } from "./routes/auth";
import { createOrder, webhook } from "./routes/cashfree";
import { seedDemo } from "./routes/seed";
import { getProjectTimeline, listAllProjects } from "./routes/explorer";
import {
  createProgram,
  listPrograms,
  applyProject,
  listProjects,
  approveProject,
  defineMilestone,
  listMilestones,
  submitAttestation,
  triggerRelease,
  bankQueue,
  bankApprove,
  revoke,
  clawback,
  getAuditorProjects,
  getAuditorProject,
} from "./routes/workflow";
import { authOptional, authRequired, requireRole } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: [
      'https://subsidy-iota.vercel.app',
      'https://subsidy-git-main-rags-projects-3508ec91.vercel.app',
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Handle CORS preflight requests
  app.options('*', cors());

  // Example API routes
  app.get("/api", (_req, res) => {
    res.json({ 
      message: "Subsidy API", 
      version: "1.0.0",
      endpoints: {
        health: "/api/ping",
        auth: "/api/auth/*",
        gov: "/api/gov/*",
        producer: "/api/producer/*",
        auditor: "/api/auditor/*",
        bank: "/api/bank/*",
        explorer: "/api/explorer/*"
      }
    });
  });

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth OTP + JWT
  app.post("/api/auth/request-otp", requestOtp);
  app.post("/api/auth/verify-otp", verifyOtp);
  app.post("/api/auth/static-login", staticLogin);
  app.get("/api/auth/me", me);

  // Cashfree payment gateway
  app.post("/api/cashfree/order", createOrder);
  app.post("/api/cashfree/webhook", webhook);

  // Demo seed and explorer
  app.post("/api/seed", seedDemo);
  app.get("/api/explorer/projects", listAllProjects);
  app.get("/api/explorer/project/:id", getProjectTimeline);

  // Public reads
  app.get("/api/gov/programs", listPrograms);
  app.get("/api/gov/milestones", listMilestones);

  // Auth attach (optional by default)
  app.use("/api", authOptional);

  // Gov Admin
  app.post(
    "/api/gov/programs",
    authRequired,
    requireRole(["gov"]),
    createProgram,
  );
  app.get(
    "/api/gov/projects",
    authRequired,
    requireRole(["gov"]),
    listProjects,
  );
  app.post(
    "/api/gov/projects/:id/approve",
    authRequired,
    requireRole(["gov"]),
    approveProject,
  );
  app.post(
    "/api/gov/milestones",
    authRequired,
    requireRole(["gov"]),
    defineMilestone,
  );
  app.post(
    "/api/gov/release",
    authRequired,
    requireRole(["gov"]),
    triggerRelease,
  );
  app.post("/api/gov/revoke", authRequired, requireRole(["gov"]), revoke);
  app.post("/api/gov/clawback", authRequired, requireRole(["gov"]), clawback);

  // Producer
  app.post(
    "/api/producer/projects",
    authRequired,
    requireRole(["producer"]),
    applyProject,
  );

  // Auditor
  app.get(
    "/api/auditor/projects",
    authRequired,
    requireRole(["auditor"]),
    getAuditorProjects,
  );
  app.get(
    "/api/auditor/projects/:id",
    authRequired,
    requireRole(["auditor"]),
    getAuditorProject,
  );
  app.post(
    "/api/auditor/attest",
    authRequired,
    requireRole(["auditor"]),
    submitAttestation,
  );

  // Bank Ops
  app.get("/api/bank/queue", authRequired, requireRole(["bank"]), bankQueue);
  app.post(
    "/api/bank/approve",
    authRequired,
    requireRole(["bank"]),
    bankApprove,
  );

  return app;
}
