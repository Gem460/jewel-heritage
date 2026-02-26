import { useEffect, useMemo, useState } from "react";

function onlyDigits(s) {
  return (s || "").replace(/\D/g, "");
}

function formatCardNumber(inputDigits, brand) {
  const d = onlyDigits(inputDigits).slice(0, brand === "amex" ? 15 : 19);

  // Amex: 4-6-5
  if (brand === "amex") {
    const p1 = d.slice(0, 4);
    const p2 = d.slice(4, 10);
    const p3 = d.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }

  // Default: groups of 4
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function detectBrand(cardDigits) {
  const d = onlyDigits(cardDigits);

  // Very lightweight detection
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5])/.test(d) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(d))
    return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^(6011|65|64[4-9])/.test(d)) return "discover";
  if (/^35/.test(d)) return "jcb";
  if (/^62/.test(d)) return "unionpay";
  return "unknown";
}

function luhnCheck(cardDigits) {
  const d = onlyDigits(cardDigits);
  if (d.length < 12) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = d.length - 1; i >= 0; i--) {
    let digit = parseInt(d[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function formatExpiry(raw) {
  const d = onlyDigits(raw).slice(0, 4); // MMYY
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function isValidExpiry(mmYY) {
  const v = (mmYY || "").trim();
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;
  const mm = parseInt(v.slice(0, 2), 10);
  const yy = parseInt(v.slice(3, 5), 10);
  if (mm < 1 || mm > 12) return false;

  // Compare with current month/year
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;

  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;

  return true;
}

function brandLabel(brand) {
  switch (brand) {
    case "visa":
      return "VISA";
    case "mastercard":
      return "MASTERCARD";
    case "amex":
      return "AMEX";
    case "discover":
      return "DISCOVER";
    case "jcb":
      return "JCB";
    case "unionpay":
      return "UNIONPAY";
    default:
      return "CARD";
  }
}

function cvcMaxLen(brand) {
  return brand === "amex" ? 4 : 3;
}

export default function BookingModal({ isOpen, onClose, selectedRoom }) {
  const [step, setStep] = useState("form"); // "form" | "success"

  // Booking fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Payment choice
  const [payAtHotel, setPayAtHotel] = useState(true);

  // Card fields (demo only)
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const brand = useMemo(() => detectBrand(cardNumber), [cardNumber]);

  const [errors, setErrors] = useState({});

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Reset when opening/closing or switching room
  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setErrors({});
      return;
    }
    // When opening, keep previous typing if you want; otherwise reset:
    // (I’m leaving guest details as-is for convenience)
    setErrors({});
  }, [isOpen, selectedRoom]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!selectedRoom) e.selectedRoom = "Room type is missing.";
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Enter a valid email.";

    if (!checkIn) e.checkIn = "Check-in date is required.";
    if (!checkOut) e.checkOut = "Check-out date is required.";
    if (checkIn && checkOut) {
      const inD = new Date(checkIn);
      const outD = new Date(checkOut);
      if (outD <= inD) e.checkOut = "Check-out must be after check-in.";
    }

    if (!payAtHotel) {
      // Card required in "Pay now" mode (demo)
      if (!cardholder.trim()) e.cardholder = "Cardholder name is required.";

      const digits = onlyDigits(cardNumber);
      if (!digits) e.cardNumber = "Card number is required.";
      else {
        const expectedLen = brand === "amex" ? 15 : 16;
        if (digits.length < expectedLen) e.cardNumber = `Card number looks too short.`;
        else if (!luhnCheck(digits)) e.cardNumber = "Card number is not valid.";
      }

      if (!expiry.trim()) e.expiry = "Expiry is required.";
      else if (!isValidExpiry(expiry)) e.expiry = "Expiry must be valid (MM/YY).";

      const cvcDigits = onlyDigits(cvc);
      const maxLen = cvcMaxLen(brand);
      if (!cvcDigits) e.cvc = "CVC is required.";
      else if (cvcDigits.length !== maxLen)
        e.cvc = `CVC must be ${maxLen} digits for this card.`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // Demo success screen
    setStep("success");
  };

  const closeAndReset = () => {
    // optional reset
    setStep("form");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>

        {step === "success" ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700 text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold">Booking Request Sent</h2>
            <p className="mt-2 text-sm text-gray-600">
              Demo mode: your booking is not charged. We’ll confirm availability and contact you soon.
            </p>

            <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-left">
              <div className="text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Room</span>
                  <span className="font-medium">{selectedRoom}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{fullName || "-"}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4">
                  <span className="text-gray-600">Dates</span>
                  <span className="font-medium">
                    {checkIn || "-"} → {checkOut || "-"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-4">
                  <span className="text-gray-600">Payment</span>
                  <span className="font-medium">
                    {payAtHotel ? "Pay at hotel" : "Pay now (card) — demo"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={closeAndReset}
              className="mt-6 w-full rounded-full bg-[#7A1C1C] py-3 text-white hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room */}
              <div>
                <label className="block text-sm font-medium">Room Type</label>
                <input
                  type="text"
                  value={selectedRoom}
                  readOnly
                  className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-100"
                />
                {errors.selectedRoom && (
                  <p className="mt-1 text-xs text-red-600">{errors.selectedRoom}</p>
                )}
              </div>

              {/* Guest */}
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                  {errors.checkIn && (
                    <p className="mt-1 text-xs text-red-600">{errors.checkIn}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                  {errors.checkOut && (
                    <p className="mt-1 text-xs text-red-600">{errors.checkOut}</p>
                  )}
                </div>
              </div>

              {/* Payment choice */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Payment</h3>

                <div className="flex items-center gap-2">
                  <input
                    id="payAtHotel"
                    type="checkbox"
                    checked={payAtHotel}
                    onChange={(e) => setPayAtHotel(e.target.checked)}
                  />
                  <label htmlFor="payAtHotel" className="text-sm">
                    Pay at hotel (no online charge now)
                  </label>
                </div>

                {!payAtHotel && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Card details (Demo)</p>
                      <span className="text-[11px] rounded-full border bg-white px-2 py-1">
                        {brandLabel(brand)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-600">
                      Demo only. Later we’ll replace this with secure Stripe fields.
                    </p>

                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardholder}
                          onChange={(e) => setCardholder(e.target.value)}
                          placeholder="Full name on card"
                          className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                        {errors.cardholder && (
                          <p className="mt-1 text-xs text-red-600">{errors.cardholder}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Card Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => {
                            const digits = onlyDigits(e.target.value);
                            const b = detectBrand(digits);
                            setCardNumber(formatCardNumber(digits, b));
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium">Expiry</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                          />
                          {errors.expiry && (
                            <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium">CVC</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cvc}
                            onChange={(e) => {
                              const max = cvcMaxLen(brand);
                              setCvc(onlyDigits(e.target.value).slice(0, max));
                            }}
                            placeholder={brand === "amex" ? "1234" : "123"}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                          />
                          {errors.cvc && (
                            <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#7A1C1C] py-3 text-white hover:opacity-90"
              >
                Confirm Booking
              </button>

              <p className="text-[11px] text-gray-500">
                For “Pay at hotel”, we may require a card guarantee later (secure payment provider).
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}