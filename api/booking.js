// api/booking.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helpers
const json = (res, status, data) => {
  res.statusCode = status; // ✅ FIXED
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

export default async function handler(req, res) {
  // Basic CORS
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

    // Validate required fields
    if (!fullName || !email || !phone || !checkIn || !checkOut) {
      return json(res, 400, { error: "Missing required fields" });
    }
    if (!isValidEmail(email)) {
      return json(res, 400, { error: "Invalid email address" });
    }

    // Sender: use your domain sender once verified
    // Example MAIL_FROM: reservations@thejewelheritage.com
    const FROM = process.env.MAIL_FROM || "onboarding@resend.dev";

    // Email content for hotel
    const subject = `Jewel Heritage Booking ${confirmationNo ? `(${confirmationNo})` : ""}`.trim();

    const hotelText = `
New Booking Request

Confirmation: ${confirmationNo || "N/A"}
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

    // 1) Send to HOTEL
    const toHotel = await resend.emails.send({
      from: `Jewel Heritage <${FROM}>`,
      to: process.env.HOTEL_INBOX,
      subject,
      text: hotelText,
      // ✅ Recommended: hotel staff replies go to hotel inbox (or change to guest email if you prefer)
      reply_to: process.env.HOTEL_INBOX,
    });

    // 2) Send confirmation to GUEST
    const guestSubject = `Your booking request ${confirmationNo ? `(${confirmationNo})` : ""}`.trim();
    const guestText =
      `Hi ${fullName},\n\n` +
      `We received your booking request.\n\n` +
      `Confirmation: ${confirmationNo || "N/A"}\n` +
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
      // ✅ If guest replies, it should go to hotel
      reply_to: process.env.HOTEL_INBOX,
    });

    return json(res, 200, {
      ok: true,
      confirmationNo: confirmationNo || null,
      hotelMessageId: toHotel?.data?.id || null,
      guestMessageId: toGuest?.data?.id || null,
    });
  } catch (err) {
    console.error("BOOKING_API_ERROR:", err);

    // If Resend returns a useful message, bubble it up
    const detail =
      err?.response?.data || err?.response || err?.message || String(err);

    return json(res, 500, {
      error: "Server error sending email",
      detail,
    });
  }
}