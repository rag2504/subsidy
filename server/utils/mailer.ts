import nodemailer from "nodemailer";

const host = process.env.EMAIL_HOST;
const port = Number(process.env.EMAIL_PORT || 587);
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const from = process.env.EMAIL_FROM || user || "no-reply@example.com";

if (!host || !user || !pass) {
  // eslint-disable-next-line no-console
  console.warn("Email env vars missing; mailer will be disabled.");
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: user && pass ? { user, pass } : undefined,
});

export async function sendOtpEmail(to: string, otp: string) {
  if (!host || !user || !pass) {
    // For development, just log the OTP instead of sending email
    console.log(`[DEV] OTP for ${to}: ${otp}`);
    return "dev-message-id";
  }
  const info = await transporter.sendMail({
    from,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
  return info.messageId;
}
