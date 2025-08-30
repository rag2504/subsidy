import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";
import { generateProjectId } from "../utils/id";

export const getMyProjects: RequestHandler = async (req, res) => {
  const user = (req as any).user;
  const projects = await getCollection("projects");
  const list = await projects.find({ ownerId: user.sub }).project({ _id: 0 }).toArray();
  res.json(list);
};

export const createProject: RequestHandler = async (req, res) => {
  const user = (req as any).user;
  const { name } = req.body as any;
  if (!name) return res.status(400).json({ error: "name required" });
  const projects = await getCollection("projects");
  const id = generateProjectId(name);
  await projects.insertOne({ id, name, ownerId: user.sub, ownerEmail: user.email, status: "pending", createdAt: new Date() });
  res.json({ id, name, status: "pending" });
};

export const submitDailyData: RequestHandler = async (req, res) => {
  const user = (req as any).user;
  const { projectId, kwh, date } = req.body as any;
  if (!projectId || kwh == null) return res.status(400).json({ error: "projectId and kwh required" });
  const data = await getCollection("productionData");
  await data.insertOne({ projectId, ownerId: user.sub, kwh: Number(kwh), date: date ? new Date(date) : new Date(), status: "submitted" });
  res.json({ ok: true });
};

export const updateBankProfile: RequestHandler = async (req, res) => {
  const user = (req as any).user;
  const { upi, bank } = req.body as any;
  const users = await getCollection("users");
  await users.updateOne({ _id: (await users.findOne({ email: user.email }))?._id }, { $set: { profile: { ...(upi ? { upi } : {}), ...(bank ? { bank } : {}) } } }, { upsert: true });
  res.json({ ok: true });
};
