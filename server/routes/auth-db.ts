import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-not-for-prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

async function hashPassword(pw: string) {
  const salt = crypto.randomBytes(16);
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(pw, salt, 64, (err, k) => (err ? reject(err) : resolve(k as Buffer)));
  });
  return `${salt.toString("hex")}.${derived.toString("hex")}`;
}

async function verifyPassword(pw: string, hash: string) {
  const [saltHex, keyHex] = hash.split(".");
  const salt = Buffer.from(saltHex, "hex");
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(pw, salt, 64, (err, k) => (err ? reject(err) : resolve(k as Buffer)));
  });
  return crypto.timingSafeEqual(Buffer.from(keyHex, "hex"), derived);
}

export const signupProducer: RequestHandler = async (req, res) => {
  const { email, password, name, upi, bank } = req.body as any;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  const users = await getCollection("users");
  const exists = await users.findOne({ email });
  if (exists) return res.status(409).json({ error: "email taken" });
  const pw = await hashPassword(password);
  await users.insertOne({ role: "producer", email, password: pw, profile: { name: name || "", upi, bank } });
  res.json({ ok: true });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as any;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  const users = await getCollection("users");
  const u = await users.findOne({ email });
  if (!u) return res.status(401).json({ error: "invalid creds" });
  const ok = await verifyPassword(password, (u as any).password);
  if (!ok) return res.status(401).json({ error: "invalid creds" });
  const token = jwt.sign({ sub: (u as any)._id.toString(), email: u.email, role: (u as any).role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, role: (u as any).role });
};

export const seedStaticUsers: RequestHandler = async (_req, res) => {
  const users = await getCollection("users");
  const ensure = async (email: string, role: string, password: string) => {
    const existing = await users.findOne({ email });
    if (!existing) {
      await users.insertOne({ email, role, password: await hashPassword(password), profile: {} });
    }
  };
  await ensure("gov@gov.local", "gov", "Passw0rd!");
  await ensure("auditor@audit.local", "auditor", "Passw0rd!");
  await ensure("bank@bank.local", "bank", "Passw0rd!");
  res.json({ ok: true });
};
