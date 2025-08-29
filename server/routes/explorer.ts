import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";

export const listAllProjects: RequestHandler = async (_req, res) => {
  const projects = await getCollection("projects");
  const programs = await getCollection("programs");
  
  const projectList = await projects.find().project({ _id: 0 }).toArray();
  
  // Get program names for each project
  const projectsWithPrograms = await Promise.all(
    projectList.map(async (project) => {
      const program = await programs.findOne({ id: project.program });
      return {
        ...project,
        programName: program?.name || project.program
      };
    })
  );
  
  res.json(projectsWithPrograms);
};

export const getProjectTimeline: RequestHandler = async (req, res) => {
  const id = req.params.id;
  
  // Get all collections
  const projects = await getCollection("projects");
  const events = await getCollection("events");
  const programs = await getCollection("programs");
  const milestones = await getCollection("milestones");
  const attestations = await getCollection("attestations");
  const disbursements = await getCollection("disbursements");

  // Get project details
  const project = await projects.findOne({ id });
  if (!project) return res.status(404).json({ error: "project not found" });

  // Get program details
  const program = await programs.findOne({ id: project.program });
  const programName = program?.name || project.program;

  // Get all events for this project
  const projectEvents = await events
    .find({ projectId: id })
    .sort({ ts: 1 })
    .project({ _id: 0 })
    .toArray();

  // Get milestones for this program
  const programMilestones = await milestones
    .find({ programId: project.program })
    .sort({ key: 1 })
    .project({ _id: 0 })
    .toArray();

  // Get attestations for this project
  const projectAttestations = await attestations
    .find({ projectId: id })
    .sort({ createdAt: 1 })
    .project({ _id: 0 })
    .toArray();

  // Get disbursements for this project
  const projectDisbursements = await disbursements
    .find({ projectId: id })
    .sort({ createdAt: 1 })
    .project({ _id: 0 })
    .toArray();

  // Build comprehensive timeline
  const timeline = [];

  // Add project creation event
  if (project.createdAt) {
    timeline.push({
      ts: project.createdAt,
      type: "project_created",
      label: `Project Created: ${project.name}`,
      details: {
        projectId: project.id,
        program: programName,
        email: project.email
      }
    });
  }

  // Add program creation if available
  if (program?.createdAt) {
    timeline.push({
      ts: program.createdAt,
      type: "program_created",
      label: `Program Created: ${programName}`,
      details: { programId: program.id }
    });
  }

  // Add milestone definitions
  for (const milestone of programMilestones) {
    timeline.push({
      ts: milestone.createdAt,
      type: "milestone_defined",
      label: `Milestone ${milestone.key} Defined: ${milestone.title}`,
      details: {
        key: milestone.key,
        amount: milestone.amount,
        unit: milestone.unit
      }
    });
  }

  // Add project approval event
  if (project.status === "approved") {
    const approvalEvent = projectEvents.find(e => e.type === "project_approved");
    if (approvalEvent) {
      timeline.push(approvalEvent);
    }
  }

  // Add attestations
  for (const attestation of projectAttestations) {
    timeline.push({
      ts: attestation.createdAt,
      type: "attested",
      label: `Auditor Attested: ${attestation.milestoneKey}`,
      details: {
        milestoneKey: attestation.milestoneKey,
        value: attestation.value,
        unit: attestation.unit,
        dataHash: attestation.dataHash,
        signer: attestation.signer
      }
    });
  }

  // Add disbursements
  for (const disbursement of projectDisbursements) {
    const statusText = disbursement.status === "queued" ? "Queued" : "Released";
    timeline.push({
      ts: disbursement.createdAt,
      type: disbursement.status === "queued" ? "release_queued" : "released",
      label: `Payment ${statusText}: ${disbursement.milestoneKey}`,
      details: {
        milestoneKey: disbursement.milestoneKey,
        amount: disbursement.amount,
        rail: disbursement.rail,
        status: disbursement.status,
        bankRefOrTx: disbursement.bankRefOrTx
      }
    });
  }

  // Add other events from the events collection
  for (const event of projectEvents) {
    if (!["project_approved"].includes(event.type)) {
      timeline.push(event);
    }
  }

  // Sort timeline by timestamp
  timeline.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());

  // Calculate project statistics
  const totalAttestations = projectAttestations.length;
  const totalDisbursements = projectDisbursements.length;
  const totalAmount = projectDisbursements
    .filter(d => d.status === "released")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  res.json({
    id,
    program: programName,
    project: project.name,
    status: project.status,
    email: project.email,
    createdAt: project.createdAt,
    items: timeline,
    statistics: {
      totalAttestations,
      totalDisbursements,
      totalAmount,
      milestones: programMilestones.length
    }
  });
};
