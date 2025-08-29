import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { requestOtp, verifyOtp, me } from "./routes/auth";
import { createOrder, webhook } from "./routes/cashfree";
import { seedDemo } from "./routes/seed";
import { getProjectTimeline } from "./routes/explorer";

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

  return app;
}
