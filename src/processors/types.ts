import { Tuple } from "../tuple";

export type Callback<T = void> = (value: T) => void;
export type Callbacks<T extends Tuple> = {
  [K in keyof T]: Callback<T[K]>;
};
export type NamedCallbacks<T extends object> = {
  [K in keyof T]: Callback<T[K]>;
};

export type Processor<I, O = I> = (callback: Callback<O>) => Callback<I>;

// Specialized binary input processor
export type ClosableProcessor<I1, O = I1> = (
  callback: Callback<O>
) => [onValue: Callback<I1>, onClose: Callback];

export type ProcessorMultiIn<I extends Tuple, O> = (
  callback: Callback<O>
) => Callbacks<I>;

export type ProcessorMultiOut<I, O extends Tuple> = (
  callback: Callbacks<O>
) => Callback<I>;

export type ProcessorMultiInMultiOut<I extends Tuple, O extends Tuple> = (
  callback: Callbacks<O>
) => Callbacks<I>;
