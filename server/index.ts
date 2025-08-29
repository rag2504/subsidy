import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { requestOtp, verifyOtp, me } from "./routes/auth";
import { createOrder, webhook } from "./routes/cashfree";
import { seedDemo } from "./routes/seed";
import { getProjectTimeline } from "./routes/explorer";
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
} from "./routes/workflow";
import { authOptional, authRequired, requireRole } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth OTP + JWT
  app.post("/api/auth/request-otp", requestOtp);
  app.post("/api/auth/verify-otp", verifyOtp);
  app.get("/api/auth/me", me);

  // Cashfree payment gateway
  app.post("/api/cashfree/order", createOrder);
  app.post("/api/cashfree/webhook", webhook);

  // Demo seed and explorer
  app.post("/api/seed", seedDemo);
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
