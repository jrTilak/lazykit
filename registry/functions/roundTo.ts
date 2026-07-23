const shiftExponent = (value: number, exponent: number): number => {
  if (value === 0) return value;
  const [coefficient, current = "0"] = String(value).split("e");
  return Number(`${coefficient}e${Number(current) + exponent}`);
};

/** Rounds a finite number with Math.round tie semantics and guarded exponent shifts. */
export const roundTo = (value: number, precision: number = 0): number => {
  if (!Number.isFinite(value)) throw new RangeError("value must be finite");
  if (!Number.isSafeInteger(precision) || Math.abs(precision) > 100) {
    throw new RangeError("precision must be a safe integer between -100 and 100");
  }
  if (precision === 0) return Math.round(value);

  const shifted = shiftExponent(value, precision);
  if (!Number.isFinite(shifted)) {
    // A positive shift can overflow only when the requested decimal place is far
    // below the number's representable precision, so rounding cannot change it.
    if (precision > 0) return value;
    throw new RangeError("rounded value is outside the finite number range");
  }

  const result = shiftExponent(Math.round(shifted), -precision);
  if (!Number.isFinite(result)) {
    throw new RangeError("rounded value is outside the finite number range");
  }
  return result;
};
