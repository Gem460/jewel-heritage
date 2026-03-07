import { useState } from "react";
import { Link } from "react-router-dom";

const CANCEL_API =
  import.meta.env.VITE_API_BASE
    ? `${import.meta.env.VITE_API_BASE}/api/cancel`
    : "https://thejewelheritage.com/api/cancel";

export default function Cancellation() {
  const [form, setForm] = useState({
    confirmation: "",
    email: "",
    reason: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    if (!form.confirmation.trim())
      return "Please enter your booking confirmation number.";

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter the email used for the booking.";

    return "";
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        confirmationNumber: form.confirmation,
        email: form.email,
        reason: form.reason,
      };

      const res = await fetch(CANCEL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Could not send cancellation request.");
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">

          <h1 className="text-4xl font-semibold">
            Cancellation request sent
          </h1>

          <p className="mt-4 text-gray-700">
            Your cancellation request has been sent to the hotel.
            A confirmation email has also been sent to your email address.
          </p>

          <div className="mt-6 text-lg">
            Confirmation Number:
            <span className="font-bold ml-2">
              {form.confirmation}
            </span>
          </div>

          <Link
            to="/"
            className="mt-8 inline-block rounded-full bg-black text-white px-6 py-3 font-semibold"
          >
            Back to Home
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16">

        <h1 className="text-4xl font-semibold">
          Cancel Booking
        </h1>

        <p className="mt-2 text-gray-600">
          Enter your confirmation number to request cancellation.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 border rounded-2xl p-8"
        >

          {errorMsg && (
            <div className="text-red-600 text-sm">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">
              Confirmation Number *
            </label>

            <input
              value={form.confirmation}
              onChange={update("confirmation")}
              placeholder="JH-20260304-4821"
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Email used for booking *
            </label>

            <input
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Reason (optional)
            </label>

            <textarea
              value={form.reason}
              onChange={update("reason")}
              rows="4"
              placeholder="Change of plans, flight delay..."
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-red-600 text-white px-8 py-3 font-semibold"
          >
            {submitting ? "Sending..." : "Cancel Booking"}
          </button>

        </form>
      </div>
    </div>
  );
}