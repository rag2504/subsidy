import type { RequestHandler } from "express";
import { otpStore } from "../utils/otpStore";
import { sendOtpEmail } from "../utils/mailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-not-for-prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Static credentials for restricted roles
const STATIC_CREDENTIALS = {
  gov: { email: "gov@subsidy.gov", password: "gov-secure-2024" },
  auditor: { email: "auditor@subsidy.gov", password: "audit-secure-2024" },
  bank: { email: "bank@subsidy.gov", password: "bank-secure-2024" }
};

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const requestOtp: RequestHandler = async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "email required" });
  
  // Check if this is a restricted role email
  const restrictedRole = Object.entries(STATIC_CREDENTIALS).find(([_, creds]) => creds.email === email);
  if (restrictedRole) {
    return res.status(400).json({ 
      error: "This email is for restricted access. Please use the password-based login instead." 
    });
  }
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  let devOtp: string | undefined;
  try {
    await sendOtpEmail(email, otp);
  } catch (e) {
    // Dev-friendly fallback: allow login by showing OTP when email isn't configured
    devOtp = otp;
    console.log(`Dev OTP for ${email}: ${otp}`);
  }
  // Always return devOtp in development for easier testing
  res.json({ ok: true, devOtp: devOtp || otp });
};

export const verifyOtp: RequestHandler = async (req, res) => {
  const { email, otp, role } = req.body as {
    email?: string;
    otp?: string;
    role?: string;
  };
  if (!email || !otp)
    return res.status(400).json({ error: "email and otp required" });
    
  // Check if this is a restricted role email
  const restrictedRole = Object.entries(STATIC_CREDENTIALS).find(([_, creds]) => creds.email === email);
  if (restrictedRole) {
    return res.status(400).json({ 
      error: "This email requires password-based authentication. Please use the restricted access login." 
    });
  }
  
  const ok = otpStore.verify(email, otp);
  if (!ok) return res.status(401).json({ error: "invalid otp" });
  
  const token = jwt.sign({ sub: email, role: role || "producer" }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
  res.json({ token });
};

// New endpoint for static credential authentication
export const staticLogin: RequestHandler = async (req, res) => {
  const { email, password, role } = req.body as {
    email?: string;
    password?: string;
    role?: string;
  };
  
  if (!email || !password || !role) {
    return res.status(400).json({ error: "email, password, and role required" });
  }
  
  // Check if role is restricted
  if (!Object.keys(STATIC_CREDENTIALS).includes(role)) {
    return res.status(400).json({ error: "invalid role for static login" });
  }
  
  const credentials = STATIC_CREDENTIALS[role as keyof typeof STATIC_CREDENTIALS];
  
  if (email === credentials.email && password === credentials.password) {
    const token = jwt.sign({ sub: email, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
    res.json({ token });
  } else {
    res.status(401).json({ error: "invalid credentials" });
  }
};

export const me: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "missing token" });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: payload });
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
};
