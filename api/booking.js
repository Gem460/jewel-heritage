import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: "Missing RESEND_API_KEY in environment variables" });
    }

    const data = req.body || {};

    // Honeypot
    if (data._gotcha) return res.status(200).json({ ok: true });

    const {
      room,
      roomId,
      rate,
      checkIn,
      checkOut,
      adults,
      children,
      airportShuttle,
      fullName,
      email,
      phone,
      notes,
      page,
      submittedAt,
    } = data;

    if (!fullName || !email || !phone || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // IMPORTANT: Before domain is verified, you can only send from Resend default addresses.
    // If Resend rejects the 'from', it will return an error we now expose.
    const fromBooking = "Jewel Heritage Booking <onboarding@resend.dev>";
    const fromGuest = "The Jewel Heritage <onboarding@resend.dev>";

    // Change this to YOUR receiving email:
    const HOTEL_INBOX = "spzbht@gmail.com";

    const bookingText = `
NEW BOOKING REQUEST

Room: ${room || ""} (${roomId || ""})
Rate: ${rate || ""}

Dates: ${checkIn} to ${checkOut}
Guests: Adults ${adults}, Children ${children}
Airport Shuttle: ${airportShuttle}

Guest:
Name: ${fullName}
Email: ${email}
Phone/WhatsApp: ${phone}

Notes:
${notes || "-"}

Page: ${page || ""}
Submitted: ${submittedAt || ""}
`.trim();

    // 1) Email to hotel
    const r1 = await resend.emails.send({
      from: fromBooking,
      to: [HOTEL_INBOX],
      replyTo: email,
      subject: `New Booking Request - ${room || "Room"}`,
      text: bookingText,
    });

    if (r1?.error) {
      return res.status(500).json({
        error: "Resend failed sending to hotel inbox",
        detail: r1.error,
      });
    }

    // 2) Confirmation email to guest
    const guestText = `
Dear ${fullName},

Thank you for your booking request at The Jewel Heritage.

We received your request:
Room: ${room || "Room"}
Check-in: ${checkIn}
Check-out: ${checkOut}

Our team will contact you shortly to confirm availability.

Warm regards,
The Jewel Heritage
Paro, Changsima, Bhutan
`.trim();

    const r2 = await resend.emails.send({
      from: fromGuest,
      to: [email],
      subject: "We received your booking request — The Jewel Heritage",
      text: guestText,
    });

    if (r2?.error) {
      return res.status(500).json({
        error: "Resend failed sending confirmation to guest",
        detail: r2.error,
      });
    }

    return res.status(200).json({ ok: true, hotelEmailId: r1.data?.id, guestEmailId: r2.data?.id });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: String(err?.message || err) });
  }
}