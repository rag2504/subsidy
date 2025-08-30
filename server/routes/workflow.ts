import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";
import { ObjectId } from "mongodb";
import multer from "multer";
import fs from "fs";
import path from "path";
import { contract, auditorWallet, provider } from "../web3/contract";
import { domain, types } from "../web3/typedData";
import { sha256Hex } from "../utils/hash";

const upload = multer({ dest: path.join(process.cwd(), "uploads") });

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

// New endpoint for auditors to get available projects
export const getAuditorProjects: RequestHandler = async (_req, res) => {
  const projects = await getCollection("projects");
  const programs = await getCollection("programs");
  const milestones = await getCollection("milestones");
  const attestations = await getCollection("attestations");

  const projectList = await projects.find({ status: "approved" }).toArray();
  
  const projectsWithDetails = await Promise.all(
    projectList.map(async (project) => {
      const program = await programs.findOne({ id: project.program });
      const projectMilestones = await milestones.find({ programId: project.program }).toArray();
      const projectAttestations = await attestations.find({ projectId: project.id }).toArray();
      
      return {
        ...project,
        programName: program?.name || project.program,
        milestones: projectMilestones,
        attestations: projectAttestations,
        _id: undefined
      };
    })
  );
  
  res.json(projectsWithDetails);
};

// New endpoint for auditors to get project details
export const getAuditorProject: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const projects = await getCollection("projects");
  const programs = await getCollection("programs");
  const milestones = await getCollection("milestones");
  const attestations = await getCollection("attestations");

  const project = await projects.findOne({ id });
  if (!project) return res.status(404).json({ error: "project not found" });

  const program = await programs.findOne({ id: project.program });
  const projectMilestones = await milestones.find({ programId: project.program }).toArray();
  const projectAttestations = await attestations.find({ projectId: project.id }).toArray();

  res.json({
    ...project,
    programName: program?.name || project.program,
    milestones: projectMilestones,
    attestations: projectAttestations,
    _id: undefined
  });
};

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

export const submitAttestation = [
  upload.single("evidence"),
  async (req: any, res: any) => {
    const { projectId, milestoneKey, value, deadline, nonce } = req.body as any;
    if (!req.file) return res.status(400).json({ error: "evidence file required" });

    // 1) Validate project/milestone as you already do
    const projects = await getCollection("projects");
    const project = await projects.findOne({ id: projectId });
    if (!project) return res.status(404).json({ error: "project not found" });
    if (project.status !== "approved") return res.status(400).json({ error: "project not approved" });
    
    const milestones = await getCollection("milestones");
    const milestone = await milestones.findOne({ programId: project.program, key: milestoneKey });
    if (!milestone) return res.status(404).json({ error: "milestone not found" });

    // 2) Compute file hash
    const buf = fs.readFileSync(req.file.path);
    const dataHash = "0x" + sha256Hex(buf);

    // 3) Build typed data and sign (server-side demo)
    const { chainId } = await provider.getNetwork();
    const message = {
      milestoneId: milestoneKey as `0x${string}`,   // use msId (bytes32) in a real app
      value: Number(value),
      dataHash,
      deadline: Number(deadline),  // unix seconds
      nonce: Number(nonce)         // increment per milestone
    };
    const signature = await (auditorWallet as any)._signTypedData(
      domain(chainId, process.env.CONTRACT_ADDRESS!), types, message
    );

    // 4) Call contract
    const tx = await contract.connect(auditorWallet as any).attestMilestone(message, signature);
    const receipt = await tx.wait();

    // 5) Persist record for Explorer
    const attestations = await getCollection("attestations");
    await attestations.insertOne({
      projectId, milestoneKey, value: Number(value),
      unit: "kg", dataHash, signer: auditorWallet.address,
      txHash: tx.hash, createdAt: new Date()
    });

    await logEvent(projectId, "attested", "Auditor Attested (EIP-712)", {
      value: Number(value), dataHash, txHash: tx.hash
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ ok: true, tx: tx.hash });
  }
] as any;

export const triggerRelease: RequestHandler = async (req, res) => {
  const { projectId, milestoneKey, amount, bankRef } = req.body as any;
  if (!projectId || !milestoneKey || !amount)
    return res.status(400).json({ error: "missing fields" });
  
  // Validate project and milestone
  const projects = await getCollection("projects");
  const project = await projects.findOne({ id: projectId });
  if (!project) return res.status(404).json({ error: "project not found" });
  
  const milestones = await getCollection("milestones");
  const milestone = await milestones.findOne({ programId: project.program, key: milestoneKey });
  if (!milestone) return res.status(404).json({ error: "milestone not found" });
  
  // Check if already released
  const disb = await getCollection("disbursements");
  const exists = await disb.findOne({ projectId, milestoneKey });
  if (exists) return res.status(409).json({ error: "already released/queued" });
  
  // Call on-chain release
  const tx = await contract.releasePayment(milestoneKey as `0x${string}`, Number(amount), bankRef || `BANK-${Date.now()}`);
  await tx.wait();

  // Persist record
  const doc = {
    projectId,
    milestoneKey,
    amount: Number(amount),
    bankRef: bankRef || `BANK-${Date.now()}`,
    status: "released",
    txHash: tx.hash,
    createdAt: new Date(),
  };
  await disb.insertOne(doc);
  
  await logEvent(projectId, "released", "Payment Released", { 
    amount, bankRef: doc.bankRef, txHash: tx.hash 
  });
  
  res.json({ ok: true, tx: tx.hash });
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
