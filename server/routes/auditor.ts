import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";

export const listSubmitted: RequestHandler = async (_req, res) => {
  const data = await getCollection("productionData");
  const list = await data.find({ status: "submitted" }).project({ _id: 0 }).toArray();
  res.json(list);
};

export const approveData: RequestHandler = async (req, res) => {
  const { projectId, date } = req.body as any;
  if (!projectId) return res.status(400).json({ error: "projectId required" });
  const data = await getCollection("productionData");
  const doc = await data.findOne({ projectId, status: "submitted" });
  if (!doc) return res.status(404).json({ error: "no submitted record" });

  // Calculate payout from program rate
  const projects = await getCollection("projects");
  const programs = await getCollection("programs");
  const disb = await getCollection("disbursements");
  const proj = await projects.findOne({ id: projectId });
  if (!proj) return res.status(400).json({ error: "project not found" });
  const program = await programs.findOne({ id: (proj as any).programId });
  const rate = (program as any)?.ratePerKwh || 0;
  const amount = rate * (doc as any).kwh;

  await data.updateOne({ projectId, status: "submitted" }, { $set: { status: "approved", approvedAt: new Date(), amount } });
  await disb.insertOne({ projectId, amount, rail: "bank", status: "queued", createdAt: new Date() });

  res.json({ ok: true, amount });
};
