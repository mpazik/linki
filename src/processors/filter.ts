import type { Predicate } from "../functions";
import { defined } from "../functions";

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
  return ([onFirst, onSecond]) => (value) => {
    predicate(value) ? onFirst(value) : onSecond(value);
  };
}

export const splitDefined = <T>(): ProcessorMultiOut<
  T | undefined,
  [T, undefined]
> => ([onFirst, onSecond]) => (value) => {
  defined(value) ? onFirst(value) : onSecond(value);
};
