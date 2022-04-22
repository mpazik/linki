import type { Reducer } from "../functions";
import { equal as defaultEqualCheck } from "../functions/utils/equal";

import type { Processor, ProcessorMultiIn } from "./processor";
import type { Callbacks } from "./types";

export const reduce =
  <S, C = void>(reducer: Reducer<S, C>, init: S): Processor<C, S> =>
  (callback) => {
    let state: S = init;
    return (change) => {
      state = reducer(state, change);
      callback(state);
    };
  };

/**
 * Combines states from multiple sources into a single array.
 *
 * It is a type of reducer that combines partial states and return combined state.
 * (state, [index, change]) => { state[index] = change; return state; }
 */
export const combine =
  <S extends unknown[]>(...init: S): ProcessorMultiIn<S, S> =>
  (callback) => {
    const state: S = init;

    return init.map((s, index) => (change: S[keyof S]) => {
      state[index] = change;
      callback(state);
    }) as unknown as Callbacks<S>;
  };

/**
 * On signal returns a state stored earlier
 *
 * It is a type of reducer that accepts "store" and "return" commands, and ignores output for store command
 * ([lastCommand, state], [command, value]) => [command, command === store ? value : state]
 * filter(([lastCommand]) => lastCommand === store)
 */
export const withState =
  <S>(initState: S): ProcessorMultiIn<[void, S], S> =>
  (callback) => {
    let state: S = initState;
    return [() => callback(state), (s) => (state = s)];
  };

/**
 * Returns an input item with a state stored earlier
 *
 * It is a type of reducer that accepts "store" and "return" commands, and ignores output for store command
 * ([lastCommand, state], [command, value]) => [command, command === store ? value : state]
 */
export const valueWithState =
  <S, V>(initState: S): ProcessorMultiIn<[V, S], [S, V]> =>
  (callback) => {
    let state: S = initState;
    return [(v) => callback([state, v]), (s) => (state = s)];
  };

/**
 * On signal returns a state stored earlier
 * The state can be undefined when it was not set yet or reset. In that case it will not be propagated downstream.
 * If you need to handle case when state is undefined please use {@link withState} with explicitly typed not set state
 */
export function withOptionalState<S>(
  initState?: S
): ProcessorMultiIn<[callback: void, set: S, reset: void], S> {
  let state = initState;
  let stateSet = arguments.length > 0;
  return (callback) => [
    () => {
      if (stateSet) callback(state!);
    },
    (s) => {
      state = s;
      stateSet = true;
    },
    () => (stateSet = false),
  ];
}

/**
 * Returns an input item with a state stored earlier.
 * The state can be undefined when it was not set yet or reset. In that case it will not be propagated downstream.
 * If you need to handle case when state is undefined please use {@link valueWithState} with explicitly typed not set state
 */
export function valueWithOptionalState<S, V>(
  initState?: S
): ProcessorMultiIn<[callback: V, set: S, reset: void], [S | undefined, V]> {
  let state: S | undefined = initState;
  let stateSet = arguments.length > 0;
  return (callback) => [
    (v) => {
      if (stateSet) {
        callback([state, v]);
      }
    },
    (s) => {
      state = s;
      stateSet = true;
    },
    () => (stateSet = false),
  ];
}

/**
 * Could be written as a reducer that attach flag if element has changed, filter that pass only changed elements and mapper that removes the flag
 */
export const passOnlyChangedFactory = (
  equalizer: (a: unknown, b: unknown) => boolean
): (<S>(initState?: S) => Processor<S>) =>
  function (initState) {
    let state = initState;
    let stateSet = arguments.length > 0;

    return (callback) => (value) => {
      if (stateSet && equalizer(state!, value)) return;
      state = value;
      stateSet = true;
      callback(value);
    };
  };

export const passOnlyChanged = passOnlyChangedFactory(defaultEqualCheck);
