import {
  Processor,
  ProcessorMultiInMultiOut,
  ProcessorMultiOut,
} from "./types";

export type AsyncProcessor<T> = ProcessorMultiOut<Promise<T>, [T, Error]>;
export type CancelableAsyncProcessor<T> = ProcessorMultiInMultiOut<
  [Promise<T>, void],
  [T, Error]
>;

export const async = <T>(): AsyncProcessor<T> => ([pushValue, pushError]) => {
  return (promise) => {
    promise.then(pushValue).catch(pushError);
  };
};

export const throttle = <T>(throttle: number): Processor<T> => (callback) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let nextQueued = false;
  let argQueued: T;

  const trigger = (arg: T) => {
    if (timeout) {
      argQueued = arg;
      nextQueued = true;
      return;
    }

    nextQueued = false;
    callback(arg);
    timeout = setTimeout(() => {
      timeout = null;
      if (nextQueued) {
        trigger(argQueued);
      }
    }, throttle);
  };
  return trigger;
};
