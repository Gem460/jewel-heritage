// api/cancel.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const json = (res, status, data) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {

  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.end();

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    return json(res, 500, { ok: false, error: "Missing RESEND_API_KEY in Vercel env" });
  }

  if (!process.env.HOTEL_INBOX) {
    return json(res, 500, { ok: false, error: "Missing HOTEL_INBOX in Vercel env" });
  }

  const { confirmationNumber, email, reason } = req.body || {};

  if (!confirmationNumber || !email) {
    return json(res, 400, { ok: false, error: "Missing confirmation number or email" });
  }

  if (!isValidEmail(email)) {
    return json(res, 400, { ok: false, error: "Invalid email address" });
  }

  const FROM_EMAIL = process.env.MAIL_FROM || "onboarding@resend.dev";
  const FROM = `Jewel Heritage <${FROM_EMAIL}>`;

  try {

    // 1️⃣ Email to hotel
    const hotelEmail = await resend.emails.send({
      from: FROM,
      to: String(process.env.HOTEL_INBOX)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      subject: `Cancellation Request — ${confirmationNumber}`,
      text: `
Cancellation Request

Confirmation: ${confirmationNumber}
Guest Email: ${email}

Reason:
${reason || "No reason provided"}

Please verify and process cancellation.
      `.trim(),
      reply_to: email,
    });

    // 2️⃣ Email to guest
    const guestEmail = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Cancellation Request Received — ${confirmationNumber}`,
      text: `
Dear Guest,

We have received your cancellation request.

Confirmation Number:
${confirmationNumber}

Our reservations team will process your request shortly.

If you did not request this cancellation please contact us.

— Jewel Heritage
Paro, Bhutan
      `.trim(),
      reply_to: String(process.env.HOTEL_INBOX).split(",")[0].trim(),
    });

    return json(res, 200, {
      ok: true,
      hotelMessageId: hotelEmail?.data?.id || hotelEmail?.id || null,
      guestMessageId: guestEmail?.data?.id || guestEmail?.id || null,
    });

  } catch (err) {

    console.error("CANCEL_API_ERROR:", err);

    return json(res, 500, {
      ok: false,
      error: "Failed to send cancellation emails",
      detail: err?.message || String(err),
    });

  }
}