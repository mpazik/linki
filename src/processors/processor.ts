import type { Tuple } from "../tuple";

import type { Callback, Callbacks, Close } from "./types";

export type Processor<I, O = I> = (callback: Callback<O>) => Callback<I>;

// Specialized binary input processor, second input is for sending close signal
export type ClosableProcessor<I1, O = I1> = (
  callback: Callback<O>
) => [onValue: Callback<I1>, onClose: Close];

export type ProcessorMultiIn<I extends Tuple, O> = (
  callback: Callback<O>
) => Callbacks<I>;

export type ProcessorMultiOut<I, O extends Tuple> = (
  callback: Callbacks<O>
) => Callback<I>;

export type ProcessorMultiInMultiOut<I extends Tuple, O extends Tuple> = (
  callback: Callbacks<O>
) => Callbacks<I>;
