import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const authOptional: RequestHandler = (req, _res, next) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    try {
      (req as any).user = jwt.verify(token, JWT_SECRET);
    } catch {}
  }
  next();
};

export const authRequired: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "missing token" });
  const token = auth.slice(7);
  try {
    (req as any).user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
};

export const requireRole = (roles: string[]): RequestHandler => (req, res, next) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "unauthenticated" });
  if (!roles.includes(user.role)) return res.status(403).json({ error: "forbidden" });
  next();
};
