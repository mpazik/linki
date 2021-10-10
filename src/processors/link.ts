import type { Tuple } from "../tuple";

import type {
  Processor,
  ProcessorMultiIn,
  ProcessorMultiOut,
} from "./processor";
import type { Provider } from "./provider";
import type { Callbacks, Callback } from "./types";

export function link<T>(callback: Callback<T>): Callback<T>;

export function link<T, S>(
  p1: Processor<T, S>,
  callback: Callback<S>
): Callback<T>;

export function link<T1, T2, S>(
  p1: Processor<T1, T2>,
  p2: Processor<T2, S>,
  callback: Callback<S>
): Callback<T1>;

export function link<T1, T2, T3, S>(
  p1: Processor<T1, T2>,
  p2: Processor<T2, T3>,
  p3: Processor<T3, S>,
  callback: Callback<S>
): Callback<T1>;

export function link<T1, T2, T3, T4, S>(
  p1: Processor<T1, T2>,
  p2: Processor<T2, T3>,
  p3: Processor<T3, T4>,
  p4: Processor<T4, S>,
  callback: Callback<S>
): Callback<T1>;

/*
 * Multi input links
 */
export function link<T extends Tuple, S>(
  p1: ProcessorMultiIn<T, S>,
  callback: Callback<S>
): Callbacks<T>;

export function link<T1 extends Tuple, T2, S>(
  p1: ProcessorMultiIn<T1, T2>,
  p2: Processor<T2, S>,
  callback: Callback<S>
): Callbacks<T1>;

export function link<T1 extends Tuple, T2, T3, S>(
  p1: ProcessorMultiIn<T1, T2>,
  p2: Processor<T2, T3>,
  p3: Processor<T3, S>,
  callback: Callback<S>
): Callbacks<T1>;

export function link<T1 extends Tuple, T2, T3, T4, S>(
  p1: ProcessorMultiIn<T1, T2>,
  p2: Processor<T2, T3>,
  p3: Processor<T3, T4>,
  p4: Processor<T4, S>,
  callback: Callback<S>
): Callbacks<T1>;

/*
 * Multi output links
 */

export function link<T, S extends Tuple>(
  p: ProcessorMultiOut<T, S>,
  callback: Callbacks<S>
): Callback<T>;

export function link<T1, T2, S extends Tuple>(
  p1: Processor<T1, T2>,
  p2: ProcessorMultiOut<T2, S>,
  callback: Callbacks<S>
): Callback<T1>;

export function link<T1, T2, T3, S extends Tuple>(
  p1: Processor<T1, T2>,
  p2: Processor<T2, T3>,
  p3: ProcessorMultiOut<T3, S>,
  callback: Callbacks<S>
): Callback<T1>;

/*
 * Closed links
 */

export function link<T, S>(
  p: Provider<T>,
  p1: Processor<T, S>,
  callback: Callback<S>
): void;

export function link<T1, T2, S>(
  p: Provider<T1>,
  p1: Processor<T1, T2>,
  p2: Processor<T2, S>,
  callback: Callback<S>
): void;

// (Provider<unknown> | Processor<unknown> | Callback<unknown> | Callbacks<any>)[]
export function link<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): T extends Tuple ? Callbacks<T> | Callback<T> : Callback<T> {
  let state = args[args.length - 1];
  for (let i = args.length - 2; i >= 0; i--) {
    state = args[i](state);
  }
  return state;
}
