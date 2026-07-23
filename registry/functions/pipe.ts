type Pipe = {
  <A>(value: A): A;
  <A, B>(value: A, ab: (value: A) => B): B;
  <A, B, C>(value: A, ab: (value: A) => B, bc: (value: B) => C): C;
  <A, B, C, D>(value: A, ab: (value: A) => B, bc: (value: B) => C, cd: (value: C) => D): D;
  <A, B, C, D, E>(value: A, ab: (value: A) => B, bc: (value: B) => C, cd: (value: C) => D, de: (value: D) => E): E;
  <A, B, C, D, E, F>(value: A, ab: (value: A) => B, bc: (value: B) => C, cd: (value: C) => D, de: (value: D) => E, ef: (value: E) => F): F;
};

/** Passes a value through a left-to-right sequence of unary functions. */
export const pipe: Pipe = (value: unknown, ...functions: Array<(value: unknown) => unknown>): unknown => {
  return functions.reduce((current, transform) => transform(current), value);
};
