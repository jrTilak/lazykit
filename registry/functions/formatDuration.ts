type DurationUnit = { label: string; milliseconds: number };
const units: DurationUnit[] = [
  { label: "d", milliseconds: 86_400_000 },
  { label: "h", milliseconds: 3_600_000 },
  { label: "m", milliseconds: 60_000 },
  { label: "s", milliseconds: 1_000 },
  { label: "ms", milliseconds: 1 },
];

/** Formats milliseconds as a compact duration with a limited number of units. */
export const formatDuration = (
  milliseconds: number,
  { maxUnits = 2 }: { maxUnits?: number } = {}
): string => {
  if (!Number.isFinite(milliseconds)) throw new RangeError("milliseconds must be finite");
  if (!Number.isSafeInteger(maxUnits) || maxUnits < 1 || maxUnits > units.length) {
    throw new RangeError(`maxUnits must be an integer from 1 to ${units.length}`);
  }
  const sign = milliseconds < 0 ? "-" : "";
  let remaining = Math.round(Math.abs(milliseconds));
  if (remaining === 0) return "0 ms";
  const parts: string[] = [];
  for (const unit of units) {
    const amount = Math.floor(remaining / unit.milliseconds);
    if (amount === 0 && parts.length === 0) continue;
    if (amount > 0) {
      parts.push(`${amount} ${unit.label}`);
      remaining -= amount * unit.milliseconds;
    }
    if (parts.length === maxUnits) break;
  }
  return sign + parts.join(" ");
};
