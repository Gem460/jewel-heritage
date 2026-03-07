// api/booking.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// build marker to confirm the deployed code
const BUILD = "booking-api-2026-03-05-v3";

const json = (res, status, data) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

function safeParse(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeConfirmationNo() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JH-${y}${m}${day}-${rand}`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.end();
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed", build: BUILD });

  try {
    if (!process.env.RESEND_API_KEY) {
      return json(res, 500, { ok: false, error: "Missing RESEND_API_KEY in Vercel env", build: BUILD });
    }
    if (!process.env.HOTEL_INBOX) {
      return json(res, 500, { ok: false, error: "Missing HOTEL_INBOX in Vercel env", build: BUILD });
    }

    const data = safeParse(req.body);

    // Honeypot
    if (data._gotcha) return json(res, 200, { ok: true, build: BUILD });

    const {
      confirmationNo,
      room,
      roomId,
      rate,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      airportShuttle,
      fullName,
      email,
      phone,
      notes,
      submittedAt,
      page,
    } = data;

    if (!fullName || !email || !phone || !checkIn || !checkOut) {
      return json(res, 400, { ok: false, error: "Missing required fields", build: BUILD });
    }
    if (!isValidEmail(email)) {
      return json(res, 400, { ok: false, error: "Invalid email address", build: BUILD });
    }

    const CONFIRM = confirmationNo || makeConfirmationNo();

    // Before domain is verified, keep this as onboarding@resend.dev
    // After domain verification, set MAIL_FROM to reservations@thejewelheritage.com
    const FROM_EMAIL = process.env.MAIL_FROM || "onboarding@resend.dev";
    const FROM = `Jewel Heritage <${FROM_EMAIL}>`;

    const subject = `Jewel Heritage Booking (${CONFIRM})`;

    const hotelText = `
New Booking Request

Confirmation: ${CONFIRM}
Guest: ${fullName}
Email: ${email}
Phone: ${phone}

Room: ${room || "N/A"} (${roomId || "N/A"})
Rate: ${rate || "N/A"}
Check-in: ${checkIn}
Check-out: ${checkOut}
Adults: ${adults ?? "N/A"}
Children: ${children ?? "N/A"}
Rooms: ${rooms ?? "N/A"}
Airport Shuttle: ${airportShuttle ? "Yes" : "No"}

Notes: ${notes || "-"}

Page: ${page || "-"}
Submitted: ${submittedAt || new Date().toISOString()}
`.trim();

    // Normalize HOTEL_INBOX (supports "a@x.com,b@y.com")
    const hotelTo = String(process.env.HOTEL_INBOX)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // 1) HOTEL email is mandatory
    let hotelMessageId = null;
    try {
      const toHotel = await resend.emails.send({
        from: FROM,
        to: hotelTo,
        subject,
        text: hotelText,
        reply_to: email, // hotel replies to guest
      });

      hotelMessageId = toHotel?.data?.id || toHotel?.id || null;

      if (toHotel?.error) {
        return json(res, 502, {
          ok: false,
          error: "Hotel email failed",
          build: BUILD,
          confirmationNo: CONFIRM,
          detail: toHotel.error,
        });
      }
    } catch (e) {
      return json(res, 502, {
        ok: false,
        error: "Hotel email failed",
        build: BUILD,
        confirmationNo: CONFIRM,
        detail: e?.message || String(e),
      });
    }

    // 2) GUEST email is best-effort (NEVER fail booking because of this)
    const guestSubject = `Your booking request (${CONFIRM})`;
    const guestText =
      `Hi ${fullName},\n\n` +
      `We received your booking request.\n\n` +
      `Confirmation: ${CONFIRM}\n` +
      `Check-in: ${checkIn}\n` +
      `Check-out: ${checkOut}\n` +
      `Room: ${room || "N/A"}\n\n` +
      `We will contact you shortly.\n\n` +
      `— Jewel Heritage\n`;

    let guestMessageId = null;
    let warning = null;

    try {
      const toGuest = await resend.emails.send({
        from: FROM,
        to: email,
        subject: guestSubject,
        text: guestText,
        reply_to: String(process.env.HOTEL_INBOX).split(",")[0].trim(), // guest replies to hotel
      });

      guestMessageId = toGuest?.data?.id || toGuest?.id || null;

      if (toGuest?.error) {
        warning = {
          type: "guest_email_blocked",
          message: "Guest email could not be sent (provider restriction). Hotel email was sent.",
          detail: toGuest.error,
        };
      }
    } catch (e) {
      warning = {
        type: "guest_email_failed",
        message: "Guest email could not be sent (likely Resend test-mode / unverified domain). Hotel email was sent.",
        detail: e?.message || String(e),
      };
    }

    // ✅ Always OK if hotel was sent successfully
    return json(res, 200, {
      ok: true,
      build: BUILD,
      confirmationNo: CONFIRM,
      hotelMessageId,
      guestMessageId,
      warning,
    });
  } catch (err) {
    console.error("BOOKING_API_ERROR:", err);
    return json(res, 500, {
      ok: false,
      build: BUILD,
      error: "Server error sending email",
      detail: err?.message || String(err),
    });
  }
}