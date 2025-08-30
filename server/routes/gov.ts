import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";
import { sendOtpEmail } from "../utils/mailer";

export const createProgramEx: RequestHandler = async (req, res) => {
  const { name, ratePerKwh, unit } = req.body as any;
  if (!name || ratePerKwh == null) return res.status(400).json({ error: "name and ratePerKwh required" });
  const programs = await getCollection("programs");
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const exists = await programs.findOne({ id });
  if (exists) return res.status(409).json({ error: "program exists" });
  await programs.insertOne({ id, name, ratePerKwh: Number(ratePerKwh), unit: unit || "kWh", createdAt: new Date() });
  res.json({ id, name });
};

export const approveProjectEx: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { programId } = req.body as any;
  const projects = await getCollection("projects");
  const programs = await getCollection("programs");
  const proj = await projects.findOne({ id });
  if (!proj) return res.status(404).json({ error: "not found" });
  await projects.updateOne({ id }, { $set: { status: "approved", programId, approvedAt: new Date() } });
  // email
  try { await sendOtpEmail((proj as any).ownerEmail, `Congratulations! Your project ${id} has been approved.`); } catch {}
  res.json({ ok: true });
};
