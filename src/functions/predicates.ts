import { PartialTuple, Tuple } from "../tuple";

import { Transformer } from "./transformers";
import { equal } from "./utils/equal";

export type Predicate<T> = Transformer<T, boolean>;

export const not = <T>(predicate: Predicate<T>) => (v: T): boolean =>
  !predicate(v);

export const and = <T>(...predicates: Predicate<T>[]) => (v: T): boolean =>
  predicates.every((p) => p(v));

export const or = <T>(...predicates: Predicate<T>[]) => (v: T): boolean =>
  predicates.some((p) => p(v));

export const is = <T>(e: T) => (v: T): boolean => e === v;
export const isEqual = <T>(e: T) => (v: T): boolean => equal(e, v);

export const nonNull = <T>(v: T | undefined | null): v is T => Boolean(v);
export const defined = <T>(v: T | undefined): v is T => v !== undefined;
export const definedProp = <T, K extends keyof T>(key: K) => (
  v: T
): v is T & Required<Pick<T, K>> => defined(v[key]);

export const definedTuple = <T extends Tuple>(
  tuple: PartialTuple<T>
): tuple is T => tuple.every(defined);
