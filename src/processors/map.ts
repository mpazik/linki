import { pipe, Transformer } from "../functions";

import { Processor } from "./types";

export function map<T, S>(f1: Transformer<T, S>): Processor<T, S>;
export function map<T1, T2, S>(
  f1: Transformer<T1, T2>,
  f2: Transformer<T2, S>
): Processor<T1, S>;
export function map<T1, T2, T3, S>(
  f1: Transformer<T1, T2>,
  f2: Transformer<T2, T3>,
  f3: Transformer<T3, S>
): Processor<T1, S>;
export function map<T1, T2, T3, T4, S>(
  f1: Transformer<T1, T2>,
  f2: Transformer<T2, T3>,
  f3: Transformer<T3, T4>,
  f4: Transformer<T4, S>
): Processor<T1, S>;

export function map<T, S>(
  ...functions: Transformer<unknown, unknown>[]
): Processor<T, S> {
  const transform = pipe(...functions) as Transformer<T, S>;
  return (callback) => {
    return (v) => callback(transform(v));
  };
}

export const cast = <T, S>(): Processor<T, S> => (callback) => (v) =>
  callback((v as unknown) as S);

export const ignoreParam = (): Processor<unknown, void> => (callback) => () =>
  callback();
