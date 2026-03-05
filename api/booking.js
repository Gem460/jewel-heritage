// api/booking.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    if (!process.env.RESEND_API_KEY) {
      return json(res, 500, { error: "Missing RESEND_API_KEY in Vercel env" });
    }
    if (!process.env.HOTEL_INBOX) {
      return json(res, 500, { error: "Missing HOTEL_INBOX in Vercel env" });
    }

    const data = safeParse(req.body);

    // Honeypot
    if (data._gotcha) return json(res, 200, { ok: true });

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
      return json(res, 400, { error: "Missing required fields" });
    }
    if (!isValidEmail(email)) {
      return json(res, 400, { error: "Invalid email address" });
    }

    // ✅ always generate on server if missing
    const CONFIRM = confirmationNo || makeConfirmationNo();

    // ✅ use verified domain sender if provided
    const FROM = process.env.MAIL_FROM || "onboarding@resend.dev";

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

    // 1) hotel email (must succeed)
    const toHotel = await resend.emails.send({
      from: `Jewel Heritage <${FROM}>`,
      to: process.env.HOTEL_INBOX,
      subject,
      text: hotelText,
      reply_to: process.env.HOTEL_INBOX,
    });

    // 2) guest email (if this fails, show the real reason)
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

    const toGuest = await resend.emails.send({
      from: `Jewel Heritage <${FROM}>`,
      to: email,
      subject: guestSubject,
      text: guestText,
      reply_to: process.env.HOTEL_INBOX,
    });

    // ✅ If Resend returns an error object, expose it
    if (toGuest?.error) {
      return json(res, 502, {
        ok: false,
        error: "Guest email failed",
        confirmationNo: CONFIRM,
        hotelMessageId: toHotel?.data?.id || null,
        detail: toGuest.error,
      });
    }

    return json(res, 200, {
      ok: true,
      confirmationNo: CONFIRM,
      hotelMessageId: toHotel?.data?.id || null,
      guestMessageId: toGuest?.data?.id || null,
    });
  } catch (err) {
    console.error("BOOKING_API_ERROR:", err);
    return json(res, 500, {
      error: "Server error sending email",
      detail: err?.message || String(err),
    });
  }
}