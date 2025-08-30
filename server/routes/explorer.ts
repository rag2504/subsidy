import type { RequestHandler } from "express";
import { getCollection } from "../db/mongo";

export const getProjectTimeline: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const projects = await getCollection("projects");
  const events = await getCollection("events");

  const project = await projects.findOne({ id });
  if (!project) return res.status(404).json({ error: "project not found" });

  const items = await events
    .find({ projectId: id })
    .sort({ ts: 1 })
    .project({ _id: 0 })
    .toArray();

  res.json({
    id,
    program: project.program,
    project: project.name,
    status: project.status,
    items,
  });
};
