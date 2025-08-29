import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";
import { ObjectId } from "mongodb";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function logEvent(
  projectId: string,
  type: string,
  label: string,
  details?: any,
) {
  const events = await getCollection("events");
  await events.insertOne({ projectId, ts: new Date(), type, label, details });
}

export const createProgram: RequestHandler = async (req, res) => {
  const { id, name } = req.body as { id?: string; name?: string };
  if (!name) return res.status(400).json({ error: "name required" });
  const programs = await getCollection("programs");
  const pid = id || slugify(name);
  const exists = await programs.findOne({ id: pid });
  if (exists) return res.status(409).json({ error: "program exists" });
  await programs.insertOne({ id: pid, name, createdAt: new Date() });
  res.json({ id: pid, name });
};

export const listPrograms: RequestHandler = async (_req, res) => {
  const programs = await getCollection("programs");
  const list = await programs.find().project({ _id: 0 }).toArray();
  res.json(list);
};

export const applyProject: RequestHandler = async (req, res) => {
  const { programId, name, email } = req.body as {
    programId?: string;
    name?: string;
    email?: string;
  };
  if (!programId || !name)
    return res.status(400).json({ error: "programId and name required" });
  const projects = await getCollection("projects");
  const id = `${slugify(name)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  await projects.insertOne({
    id,
    program: programId,
    name,
    status: "pending",
    email,
    createdAt: new Date(),
  });
  res.json({ id, programId, name, status: "pending" });
};

export const listProjects: RequestHandler = async (req, res) => {
  const { status } = req.query as { status?: string };
  const projects = await getCollection("projects");
  const filter: any = {};
  if (status) filter.status = status;
  const list = await projects.find(filter).project({ _id: 0 }).toArray();
  res.json(list);
};

export const approveProject: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const projects = await getCollection("projects");
  const proj = await projects.findOne({ id });
  if (!proj) return res.status(404).json({ error: "project not found" });
  await projects.updateOne({ id }, { $set: { status: "approved" } });
  await logEvent(id, "project_approved", `Project Approved: ${proj.name}`);
  res.json({ ok: true });
};

export const defineMilestone: RequestHandler = async (req, res) => {
  const { programId, key, title, amount, unit } = req.body as any;
  if (!programId || !key || !title)
    return res.status(400).json({ error: "programId, key, title required" });
  const milestones = await getCollection("milestones");
  const exists = await milestones.findOne({ programId, key });
  if (exists) return res.status(409).json({ error: "milestone exists" });
  await milestones.insertOne({
    programId,
    key,
    title,
    amount,
    unit,
    createdAt: new Date(),
  });
  res.json({ ok: true });
};

export const listMilestones: RequestHandler = async (req, res) => {
  const { programId } = req.query as any;
  const milestones = await getCollection("milestones");
  const filter: any = {};
  if (programId) filter.programId = programId;
  const list = await milestones.find(filter).project({ _id: 0 }).toArray();
  res.json(list);
};

export const submitAttestation: RequestHandler = async (req, res) => {
  const { projectId, milestoneKey, value, unit, dataHash, signer } =
    req.body as any;
  if (!projectId || !milestoneKey || value === undefined)
    return res.status(400).json({ error: "missing fields" });
  const attestations = await getCollection("attestations");
  const once = await attestations.findOne({ projectId, milestoneKey });
  if (once) return res.status(409).json({ error: "already attested" });
  await attestations.insertOne({
    projectId,
    milestoneKey,
    value,
    unit,
    dataHash,
    signer,
    createdAt: new Date(),
  });
  await logEvent(projectId, "attested", "Auditor Attested (EIP-712)", {
    value,
    unit,
    dataHash,
  });
  res.json({ ok: true });
};

export const triggerRelease: RequestHandler = async (req, res) => {
  const { projectId, milestoneKey, amount, rail } = req.body as any; // rail: 'bank' | 'onchain'
  if (!projectId || !milestoneKey || !amount)
    return res.status(400).json({ error: "missing fields" });
  const disb = await getCollection("disbursements");
  const exists = await disb.findOne({ projectId, milestoneKey });
  if (exists) return res.status(409).json({ error: "already released/queued" });
  const doc = {
    projectId,
    milestoneKey,
    amount: Number(amount),
    rail: rail || "bank",
    status: "queued",
    createdAt: new Date(),
  };
  const { insertedId } = await disb.insertOne(doc);
  await logEvent(
    projectId,
    "release_queued",
    `Release queued for ${milestoneKey}`,
    { amount, rail, disbursementId: insertedId.toString() },
  );
  res.json({ id: insertedId.toString(), ...doc });
};

export const bankQueue: RequestHandler = async (_req, res) => {
  const disb = await getCollection("disbursements");
  const list = await disb.find({ rail: "bank", status: "queued" }).toArray();
  res.json(
    list.map((d) => ({ ...d, id: (d as any)._id.toString(), _id: undefined })),
  );
};

export const bankApprove: RequestHandler = async (req, res) => {
  const { id, bankRef } = req.body as any;
  if (!id) return res.status(400).json({ error: "id required" });
  const disb = await getCollection("disbursements");
  const _id = new ObjectId(id);
  const doc = await disb.findOne({ _id });
  if (!doc) return res.status(404).json({ error: "not found" });
  await disb.updateOne(
    { _id },
    {
      $set: {
        status: "released",
        bankRefOrTx: bankRef || `BANK-${Date.now()}`,
      },
    },
  );
  await logEvent(doc.projectId, "released", "Payment Released", {
    bankRefOrTx: bankRef || `BANK-${Date.now()}`,
  });
  res.json({ ok: true });
};

export const revoke: RequestHandler = async (req, res) => {
  const { projectId, reason } = req.body as any;
  if (!projectId) return res.status(400).json({ error: "projectId required" });
  await logEvent(projectId, "revoked", "Project Revoked", { reason });
  res.json({ ok: true });
};

export const clawback: RequestHandler = async (req, res) => {
  const { projectId, amount, reason } = req.body as any;
  if (!projectId || !amount)
    return res.status(400).json({ error: "projectId and amount required" });
  await logEvent(projectId, "clawback", "Clawback initiated", {
    amount,
    reason,
  });
  res.json({ ok: true });
};
