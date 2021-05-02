export type Transformer<T, S> = (v: T) => S;

export const identity = <T>(): Transformer<T, T> => (v: T): T => v;

export const ignore: Transformer<unknown, void> = () => {
  // do nothing
};

export const to = <T>(v: T): Transformer<unknown, T> => (): T => v;

/**
 * Returns first item from an array
 */
export const head = <T extends unknown[], H>(): Transformer<[H, ...T], H> => (
  tuple
): H => tuple[0];

/**
 * Returns an array without first item
 */
export const tail = <T extends unknown[]>(): Transformer<
  readonly [unknown, ...T],
  T
> => (array): T => {
  // eslint-disable-next-line unused-imports/no-unused-vars-ts,@typescript-eslint/no-unused-vars
  const [, ...tail] = array;
  return tail;
};

/**
 * Returns a property value of an object
 */
export const pick = <T extends object, K extends keyof T>(
  key: K
): Transformer<T, T[K]> => (v) => v[key];

/**
 * Box value to an object with a given key
 */
export const wrap = <V, K extends keyof never>(
  key: K
): Transformer<V, { [A in K]: V }> => (value) =>
  ({ [key]: value } as { [A in K]: V });

/**
 * Atteches the result of the transformation to the original value
 */
export const attach = <T, S>(t: Transformer<T, S>): Transformer<T, [T, S]> => (
  v
) => [v, t(v)];

/**
 * Transform tuple to an object for all provided keys
 */
export const toObject = <T>(
  ...keys: (keyof T)[]
): Transformer<T[keyof T][], T> => (values) =>
  keys.reduce((acc, key, i) => ({ ...acc, [key]: values[i] }), <T>{});

export function pipe<T, S>(f1: (v: T) => S): Transformer<T, S>;
export function pipe<T, S, U>(
  f1: (v: T) => S,
  f2: (v: S) => U
): Transformer<T, U>;
export function pipe<T, S, U, W>(
  f1: (v: T) => S,
  f2: (v: S) => U,
  f3: (v: U) => W
): Transformer<T, W>;
export function pipe<T, S, U, W, Q>(
  f1: (v: T) => S,
  f2: (v: S) => U,
  f3: (v: U) => W,
  f4: (v: W) => Q
): Transformer<T, Q>;
export function pipe(
  ...functions: Transformer<unknown, unknown>[]
): Transformer<unknown, unknown>;
export function pipe(
  ...functions: Transformer<unknown, unknown>[]
): Transformer<unknown, unknown> {
  return (v) =>
    functions.reduce(
      (v, transform: Transformer<unknown, unknown>) => transform(v),
      v
    );
}
