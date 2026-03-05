export function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  const diff = b - a;
  const nights = Math.round(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, nights);
}

export function fmtDateShort(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}