export type UnaryFunction<in Input, out Output> = (
  this: void,
  value: Input
) => Output;

export type Pipe = {
  <A>(value: A): A;
  <A, B>(value: A, ab: UnaryFunction<A, B>): B;
  <A, B, C>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>
  ): C;
  <A, B, C, D>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>
  ): D;
  <A, B, C, D, E>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>
  ): E;
  <A, B, C, D, E, F>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>
  ): F;
  <A, B, C, D, E, F, G>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>
  ): G;
  <A, B, C, D, E, F, G, H>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>
  ): H;
  <A, B, C, D, E, F, G, H, I>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>
  ): I;
  <A, B, C, D, E, F, G, H, I, J>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>,
    ij: UnaryFunction<I, J>
  ): J;
  <A, B, C, D, E, F, G, H, I, J, K>(
    value: A,
    ab: UnaryFunction<A, B>,
    bc: UnaryFunction<B, C>,
    cd: UnaryFunction<C, D>,
    de: UnaryFunction<D, E>,
    ef: UnaryFunction<E, F>,
    fg: UnaryFunction<F, G>,
    gh: UnaryFunction<G, H>,
    hi: UnaryFunction<H, I>,
    ij: UnaryFunction<I, J>,
    jk: UnaryFunction<J, K>
  ): K;
};

/** Passes a value through up to ten type-compatible unary functions. */
export const pipe: Pipe = (
  value: unknown,
  ...functions: Array<UnaryFunction<unknown, unknown>>
): unknown => {
  return functions.reduce(
    (current, transform) => transform(current),
    value
  );
};
