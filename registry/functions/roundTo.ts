const shiftExponent = (value: number, exponent: number): number => {
  const [coefficient, current = "0"] = String(value).split("e");
  return Number(`${coefficient}e${Number(current) + exponent}`);
};

/** Rounds a finite number to a decimal position without multiplying directly. */
export const roundTo = (value: number, precision: number = 0): number => {
  if (!Number.isFinite(value)) throw new RangeError("value must be finite");
  if (!Number.isSafeInteger(precision) || Math.abs(precision) > 100) {
    throw new RangeError("precision must be a safe integer between -100 and 100");
  }
  if (precision === 0) return Math.round(value);
  return shiftExponent(Math.round(shiftExponent(value, precision)), -precision);
};
