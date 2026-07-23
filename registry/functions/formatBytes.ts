type ByteUnit = "B" | "kB" | "MB" | "GB" | "TB" | "PB" | "KiB" | "MiB" | "GiB" | "TiB" | "PiB";

export type FormatBytesOptions = {
  binary?: boolean;
  maximumFractionDigits?: number;
  locale?: Intl.LocalesArgument;
};

/** Formats a byte count using decimal or binary units. */
export const formatBytes = (
  bytes: number,
  { binary = false, maximumFractionDigits = 1, locale }: FormatBytesOptions = {}
): string => {
  if (!Number.isFinite(bytes)) throw new RangeError("bytes must be finite");
  if (!Number.isSafeInteger(maximumFractionDigits) || maximumFractionDigits < 0 || maximumFractionDigits > 20) {
    throw new RangeError("maximumFractionDigits must be an integer from 0 to 20");
  }
  const base = binary ? 1024 : 1000;
  const units: ByteUnit[] = binary ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB"] : ["B", "kB", "MB", "GB", "TB", "PB"];
  const magnitude = bytes === 0 ? 0 : Math.max(0, Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(base)), units.length - 1));
  const value = bytes / base ** magnitude;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value)} ${units[magnitude]}`;
};
