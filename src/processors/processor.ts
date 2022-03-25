import type { Tuple } from "../tuple";

import type { Callback, Callbacks } from "./types";

export type Processor<I, O = I> = (callback: Callback<O>) => Callback<I>;

export type ProcessorMultiIn<I extends Tuple, O> = (
  callback: Callback<O>
) => Callbacks<I>;

// Specialized binary input processor, second input is for sending close signal
export type ClosableProcessor<I, O = I> = ProcessorMultiIn<
  [onValue: I, onClose: void],
  O
>;

export type ProcessorMultiOut<I, O extends Tuple> = (
  callback: Callbacks<O>
) => Callback<I>;

export type ProcessorMultiInMultiOut<I extends Tuple, O extends Tuple> = (
  callback: Callbacks<O>
) => Callbacks<I>;
