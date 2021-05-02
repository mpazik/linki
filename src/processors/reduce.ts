import { Reducer } from "../functions";
import { equal } from "../functions/utils/equal";
import { PartialTuple, Tuple } from "../tuple";

import { Callback, Callbacks, Processor, ProcessorMultiIn } from "./types";

export const reduce = <S, C = void>(
  reducer: Reducer<S, C>,
  initState: S
): Processor<C, S> => (callback) => {
  let state: S = initState;
  return (change) => {
    const newState = reducer(state, change);
    state = newState;
    callback(newState);
  };
};

/**
 * On signal returns a state stored earlier
 */
export const withState = <S>(initState: S): ProcessorMultiIn<[void, S], S> => (
  callback
) => {
  let state: S = initState;
  return [() => callback(state), (s) => (state = s)];
};

/**
 * Returns an input item with a state stored earlier
 */
export const valueWithState = <S, V>(
  initState: S
): ProcessorMultiIn<[V, S], [S, V]> => (callback) => {
  let state: S = initState;
  return [(v) => callback([state, v]), (s) => (state = s)];
};

/**
 * On signal returns a state stored earlier
 * The state can be undefined when it was not set yet or reset. In such case is up to the caller to handle that case
 */
export const withOptionalState = <S>(
  initState?: S
): ProcessorMultiIn<[callback: void, set: S, reset: void], S | undefined> => (
  callback
) => {
  let state: S | undefined = initState;
  return [() => callback(state), (s) => (state = s), () => (state = undefined)];
};

/**
 * Returns an input item with a state stored earlier.
 * The state can be undefined when it was not set yet or reset. In such case is up to the caller to handle that case
 */
export const valueWithOptionalState = <S, V>(
  initState?: S
): ProcessorMultiIn<[callback: V, set: S, reset: void], [S | undefined, V]> => (
  callback
) => {
  let state: S | undefined = initState;
  return [
    (v) => callback([state, v]),
    (s) => (state = s),
    () => (state = undefined),
  ];
};

export const withMultiState = <S extends Tuple, V = void>(
  callback: (state: PartialTuple<S>, value: V) => void,
  ...init: PartialTuple<S>
): [Callback<V>, Callbacks<S>] => {
  const state = init.slice(0);

  return [
    (v) => {
      callback((state as unknown) as PartialTuple<S>, v);
    },
    (init.map((s, n) => {
      return (newStateN: unknown) => {
        state[n] = newStateN;
      };
    }) as unknown) as {
      [K in keyof S]: Callback<S[K]>;
    },
  ];
};

// Could be written as a reducer that attach flag if element has changed, filter that pass only changed elements and mapper that removes the flag
export const passOnlyChanged = <T>(): Processor<T> => (callback) => {
  let lastValue: T;
  return (value) => {
    if (equal(value, lastValue)) return;
    lastValue = value;
    callback(value);
  };
};
