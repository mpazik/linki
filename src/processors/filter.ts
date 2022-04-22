import type { Predicate } from "../functions";
import { defined, definedProp } from "../functions";

import type { Processor, ProcessorMultiOut } from "./processor";

export function filter<T, S extends T>(
  predicate: (v: T) => v is S
): Processor<T, S>;

export function filter<T>(predicate: Predicate<T>): Processor<T>;

export function filter<T>(predicate: Predicate<T>): Processor<T> {
  return (callback) => (v) => {
    if (predicate(v)) callback(v);
  };
}

export function split<T, S>(
  predicate: (v: T | S) => v is T
): ProcessorMultiOut<T | S, [T, S]>;

export function split<T>(predicate: Predicate<T>): ProcessorMultiOut<T, [T, T]>;

export function split<T>(
  predicate: Predicate<T>
): ProcessorMultiOut<T, [T, T]> {
  return ([onFirst, onSecond]) =>
    (value) => {
      predicate(value) ? onFirst(value) : onSecond(value);
    };
}

export const splitDefined = <T>(): ProcessorMultiOut<
  T | undefined,
  [T, undefined]
> => split(defined);

export const splitDefinedProp = <T extends object, K extends keyof T>(
  key: K
): ProcessorMultiOut<T, [T & Required<Pick<T, K>>, Omit<T, K>]> =>
  split(definedProp<T, K>(key)) as ProcessorMultiOut<
    T,
    [T & Required<Pick<T, K>>, Omit<T, K>]
  >;
