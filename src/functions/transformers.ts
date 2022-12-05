export type Transformer<T, S> = (v: T) => S;

export const identity =
  <T>(): Transformer<T, T> =>
  (v: T): T =>
    v;

export const ignore: Transformer<unknown, void> = () => {
  // do nothing
};

export const to = <T>(v: (() => T) | T): Transformer<unknown, T> =>
  typeof v === "function" ? () => (v as () => T)() : () => v;

export const withDefault = <T>(
  d: (() => T) | T
): Transformer<T | undefined, T> =>
  typeof d === "function" ? (v) => v ?? (d as () => T)() : (v) => v ?? d;

/**
 * Returns first item from an array
 */
export const head =
  <T extends unknown[], H>(): Transformer<[H, ...T], H> =>
  (tuple): H =>
    tuple[0];

/**
 * Returns an array without first item
 */
export const tail =
  <T extends unknown[]>(): Transformer<readonly [unknown, ...T], T> =>
  (array): T => {
    // eslint-disable-next-line unused-imports/no-unused-vars-ts,@typescript-eslint/no-unused-vars
    const [, ...tail] = array;
    return tail;
  };

/**
 * Returns a property value of an object
 */
export const pick =
  <T extends object, K extends keyof T>(key: K): Transformer<T, T[K]> =>
  (v) =>
    v[key];

/**
 * Box value to an object with a given key
 */
export const wrap =
  <V, K extends keyof never>(key: K): Transformer<V, { [A in K]: V }> =>
  (value) =>
    ({ [key]: value } as { [A in K]: V });

/**
 * Attaches the result of the transformation to the original value
 */
export const attach =
  <T, S>(t: Transformer<T, S>): Transformer<T, [T, S]> =>
  (v) =>
    [v, t(v)];

/**
 * Transform tuple to an object for all provided keys
 */
export const toObject =
  <T>(...keys: (keyof T)[]): Transformer<T[keyof T][], T> =>
  (values) =>
    keys.reduce((acc, key, i) => ({ ...acc, [key]: values[i] }), <T>{});

export const withDefaultValue =
  <T>(defaultValue: T): Transformer<T | undefined | null, T> =>
  (value): T =>
    value ?? defaultValue;

export const cast =
  <T, S>() =>
  (v: T): S =>
    v as unknown as S;

export function pipe<T, S>(f1: (v: T) => S): Transformer<T, S>;
export function pipe<T, T2, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => S
): Transformer<T, S>;
export function pipe<T, T2, T3, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => T3,
  f3: (v: T3) => S
): Transformer<T, S>;
export function pipe<T, T2, T3, T4, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => T3,
  f3: (v: T3) => T4,
  f4: (v: T4) => S
): Transformer<T, S>;
export function pipe<T, T2, T3, T4, T5, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => T3,
  f3: (v: T3) => T4,
  f4: (v: T4) => T5,
  f5: (v: T5) => S
): Transformer<T, S>;
export function pipe<T, T2, T3, T4, T5, T6, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => T3,
  f3: (v: T3) => T4,
  f4: (v: T4) => T5,
  f5: (v: T5) => T6,
  f6: (v: T6) => S
): Transformer<T, S>;
export function pipe<T, T2, T3, T4, T5, T6, T7, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => T3,
  f3: (v: T3) => T4,
  f4: (v: T4) => T5,
  f5: (v: T5) => T6,
  f6: (v: T6) => T7,
  f7: (v: T7) => S
): Transformer<T, S>;
export function pipe<T, T2, T3, T4, T5, T6, T7, T8, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => T3,
  f3: (v: T3) => T4,
  f4: (v: T4) => T5,
  f5: (v: T5) => T6,
  f6: (v: T6) => T7,
  f7: (v: T7) => T8,
  f8: (v: T8) => S
): Transformer<T, S>;
export function pipe<T, T2, T3, T4, T5, T6, T7, T8, T9, S>(
  f1: (v: T) => T2,
  f2: (v: T2) => T3,
  f3: (v: T3) => T4,
  f4: (v: T4) => T5,
  f5: (v: T5) => T6,
  f6: (v: T6) => T7,
  f7: (v: T7) => T8,
  f8: (v: T8) => T9,
  f9: (v: T9) => S
): Transformer<T, S>;
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

export const match = <T, S>(
  entries: readonly (readonly [T, S])[]
): Transformer<T, S | undefined> => {
  const map = new Map(entries);
  return (v: T) => map.get(v);
};
