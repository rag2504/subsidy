import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";

export const seedDemo: RequestHandler = async (_req, res) => {
  const projects = await getCollection("projects");
  const events = await getCollection("events");

  const id = "DEMO-PROJ-001";
  const exists = await projects.findOne({ id });
  if (!exists) {
    await projects.insertOne({ id, program: "Green H₂ Pilot 2025", name: "Electrolyzer Alpha", status: "Active" });
  }

  const haveEvents = await events.countDocuments({ projectId: id });
  if (haveEvents === 0) {
    const now = new Date();
    await events.insertMany([
      { projectId: id, ts: new Date("2025-01-10T09:00:00Z"), type: "program_created", label: "Program Created: Green H₂ Pilot 2025" },
      { projectId: id, ts: new Date("2025-01-18T15:20:00Z"), type: "project_approved", label: "Project Approved: Electrolyzer Alpha" },
      { projectId: id, ts: new Date("2025-02-05T10:00:00Z"), type: "milestone_defined", label: "Milestone M1 Defined: 10 MWh Renewable Input" },
      { projectId: id, ts: new Date("2025-03-01T11:30:00Z"), type: "attested", label: "Auditor Attested (EIP-712)", details: { value: 10, unit: "MWh", dataHash: "0xabc" } },
      { projectId: id, ts: new Date("2025-03-01T11:35:00Z"), type: "released", label: "Payment Released", details: { bankRefOrTx: "BANK-REF-001" } },
      { projectId: id, ts: new Date("2025-04-10T10:00:00Z"), type: "milestone_defined", label: "Milestone M2 Defined: 250 Kg H₂ Produced" },
      { projectId: id, ts: new Date("2025-05-02T13:45:00Z"), type: "attested", label: "Auditor Attested (EIP-712)", details: { value: 250, unit: "kgH2", dataHash: "0xdef" } },
      { projectId: id, ts: new Date("2025-05-02T13:50:00Z"), type: "released", label: "Payment Released", details: { bankRefOrTx: "BANK-REF-002" } },
      { projectId: id, ts: now, type: "seeded", label: "Seeded timeline" },
    ]);
  }

  res.json({ ok: true });
};
