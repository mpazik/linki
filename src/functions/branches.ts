import { defined } from "./predicates";
import { to } from "./transformers";
import type { Transformer } from "./transformers";

export const branch =
  <T1, T2, S>(
    p: (v: T1 | T2) => v is T1,
    map1: Transformer<T1, S>,
    map2: Transformer<T2, S>
  ): Transformer<T1 | T2, S> =>
  (v) =>
    p(v) ? map1(v) : map2(v);

export const passUndefined = <T, S>(
  map: Transformer<T, S>
): Transformer<T | undefined, S | undefined> =>
  branch<T, undefined, S | undefined>(defined, map, to(undefined));
