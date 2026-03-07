import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import rooms from "../data/roomsData";
import { nightsBetween, fmtDateShort } from "../utils/date";

export default function Pricing() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const roomId = params.get("room") || rooms?.[0]?.id;
  const search = params.get("search")?.toLowerCase() || "";
  const checkIn = params.get("checkIn") || "2026-03-05";
  const checkOut = params.get("checkOut") || "2026-03-08";
  const adults = Number(params.get("adults") || 1);
  const roomsCount = Number(params.get("rooms") || 1);

const filteredRooms = useMemo(() => {
  if (!search) return rooms;
  return rooms.filter((r) =>
    r.name.toLowerCase().includes(search)
  );
}, [search]);

const room = useMemo(() => {
  if (search) return filteredRooms[0];
  return rooms.find((r) => r.id === roomId) || rooms?.[0];
}, [roomId, filteredRooms, search]);

  const nights = useMemo(() => {
    const n = nightsBetween(checkIn, checkOut);
    return n > 0 ? n : 1;
  }, [checkIn, checkOut]);

  // ✅ auto-select a valid rate
  const [rateId, setRateId] = useState("");

  useEffect(() => {
    if (!room?.rates?.length) return;
    setRateId((prev) => {
      if (!prev) return room.rates[0].id;
      const exists = room.rates.some((x) => x.id === prev);
      return exists ? prev : room.rates[0].id;
    });
  }, [room]);

  const selectedRate = useMemo(() => {
    if (!room?.rates?.length) return null;
    return room.rates.find((x) => x.id === rateId) || room.rates[0];
  }, [room, rateId]);

  const total = useMemo(() => {
    if (!selectedRate) return 0;
    return (selectedRate.pricePerNight || 0) * nights * roomsCount;
  }, [selectedRate, nights, roomsCount]);

  if (!room) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-gray-700">
          No rooms found. Check your roomsData.js export.
        </p>
        <Link to="/" className="text-blue-700 hover:underline">
          Go Home
        </Link>
      </div>
    );
  }

  const handleContinue = () => {
    if (!selectedRate) {
      alert("Please choose a rate first.");
      return;
    }

    const next = new URLSearchParams(params.toString());
    next.set("room", room.id);
    next.set("rate", selectedRate.id);
    next.set("checkIn", checkIn);
    next.set("checkOut", checkOut);
    next.set("adults", String(adults));
    next.set("rooms", String(roomsCount));

    nav(`/pricing-confirm?${next.toString()}`);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-sm text-blue-700 hover:underline">
            ← Back to Home
          </Link>

          <div className="text-sm text-gray-600">
            {fmtDateShort(checkIn)} → {fmtDateShort(checkOut)} · {nights} night(s)
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <div className="border rounded-2xl overflow-hidden">
              {/* header */}
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="h-56 w-full object-cover"
                  />
                </div>

                <div className="md:col-span-3 p-6">
                  <h1 className="text-2xl font-semibold">{room.name}</h1>

                  <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4">
                    <span>👤 {room.maxAdults} pers. max</span>
                    {room.bed ? <span>🛏️ {room.bed}</span> : null}
                    {room.size ? <span>📐 {room.size}</span> : null}
                  </div>

                  {room.desc ? (
                    <p className="mt-3 text-gray-600 text-sm">{room.desc}</p>
                  ) : null}
                </div>
              </div>

              {/* Rates */}
              <div className="p-6 bg-gray-50 border-t">
                <div className="text-sm font-semibold text-gray-700 mb-3">
                  Choose your rate
                </div>

                {(!room.rates || room.rates.length === 0) && (
                  <div className="text-sm text-red-600">
                    No rates found for this room. Please add rates in roomsData.js.
                  </div>
                )}

                <div className="space-y-4">
                  {(room.rates || []).map((rate) => {
                    const rateTotal =
                      (rate.pricePerNight || 0) * nights * roomsCount;
                    const active = rate.id === rateId;

                    return (
                      <label
                        key={rate.id}
                        className={`block border rounded-2xl p-5 bg-white cursor-pointer transition ${
                          active
                            ? "border-blue-500 ring-2 ring-blue-100"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="rate"
                            checked={active}
                            onChange={() => setRateId(rate.id)}
                            className="mt-1"
                          />

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-lg font-semibold">
                                  {rate.label}
                                </div>
                                {rate.note ? (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {rate.note}
                                  </div>
                                ) : null}
                              </div>

                              <div className="text-right">
                                <div className="text-2xl font-semibold">
                                  {room.currency} {rateTotal.toFixed(0)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {nights} night(s) · {adults} adult · {roomsCount} room
                                </div>
                              </div>
                            </div>

                            {!!rate.perks?.length && (
                              <ul className="mt-3 text-sm text-gray-700 space-y-1">
                                {rate.perks.map((p, i) => (
                                  <li key={i}>✅ {p}</li>
                                ))}
                              </ul>
                            )}

                            <div className="mt-3 text-sm text-blue-700 hover:underline">
                              Pricing conditions
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT sticky summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 border rounded-2xl p-6 shadow-sm bg-white">
              <div className="text-lg font-semibold">The Jewel Heritage</div>

              <div className="text-sm text-gray-600 mt-1">
                Check-in 2:00 PM · Check-out 11:00 AM
              </div>

              <div className="mt-5 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates</span>
                  <span className="font-medium">
                    {fmtDateShort(checkIn)} → {fmtDateShort(checkOut)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">
                    {adults} adult · {roomsCount} room
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t pt-5">
                <div className="flex gap-3">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="h-14 w-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs text-gray-500">
                      {selectedRate?.label || ""}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {room.currency} {total.toFixed(0)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-6 w-full rounded-full bg-black text-white py-3 font-semibold hover:bg-gray-800"
                >
                  Continue
                </button>

                <div className="mt-3 text-xs text-gray-500">
                  Total shown for {nights} night(s).
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}