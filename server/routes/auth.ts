import type { RequestHandler } from "express";
import { otpStore } from "../utils/otpStore";
import { sendOtpEmail } from "../utils/mailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-not-for-prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const requestOtp: RequestHandler = async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "email required" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  try {
    await sendOtpEmail(email, otp);
  } catch (e) {
    return res.status(500).json({ error: "email not configured" });
  }
  res.json({ ok: true });
};

export const verifyOtp: RequestHandler = async (req, res) => {
  const { email, otp, role } = req.body as { email?: string; otp?: string; role?: string };
  if (!email || !otp) return res.status(400).json({ error: "email and otp required" });
  const ok = otpStore.verify(email, otp);
  if (!ok) return res.status(401).json({ error: "invalid otp" });
  const token = jwt.sign({ sub: email, role: role || "user" }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
};

export const me: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "missing token" });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: payload });
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
};
