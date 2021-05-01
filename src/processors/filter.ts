import { Processor } from "./types";

export function filter<T, S extends T>(
  predicate: (v: T) => v is S
): Processor<T, S>;

export function filter<T>(predicate: (v: T) => boolean): Processor<T>;

export function filter<T>(predicate: (v: T) => boolean): Processor<T> {
  return (callback) => (v) => {
    if (predicate(v)) callback(v);
  };
}
