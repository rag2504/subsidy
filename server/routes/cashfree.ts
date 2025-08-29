import type { RequestHandler } from "express";

const CF_BASE = process.env.CASHFREE_API_URL || "https://api.cashfree.com/pg";
const CF_ID = process.env.CASHFREE_APP_ID || "";
const CF_SECRET = process.env.CASHFREE_SECRET_KEY || "";

export const createOrder: RequestHandler = async (req, res) => {
  if (!CF_ID || !CF_SECRET) return res.status(500).json({ error: "Cashfree not configured" });
  const { order_id, amount, currency = "INR", customer_email, customer_phone } = req.body as any;
  if (!order_id || !amount || !customer_email) return res.status(400).json({ error: "missing fields" });

  const body = {
    order_id,
    order_amount: Number(amount),
    order_currency: currency,
    customer_details: {
      customer_id: customer_email,
      customer_email,
      customer_phone,
    },
    order_meta: {},
  };

  const r = await fetch(`${CF_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": CF_ID,
      "x-client-secret": CF_SECRET,
      "x-api-version": "2022-09-01",
    },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return res.status(400).json({ error: data });
  res.json(data);
};

export const webhook: RequestHandler = async (req, res) => {
  // For demo: accept and log; production should verify signature
  // eslint-disable-next-line no-console
  console.log("Cashfree webhook:", req.body);
  res.status(200).json({ ok: true });
};
