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

export const throttle = <T>(throttleTime: number): Processor<T> => (
  callback
) => {
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
    }, throttleTime);
  };
  return trigger;
};

export const debounce = <T>(debounceTime: number): Processor<T> => (
  callback
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (arg: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback(arg);
    }, debounceTime);
  };
};

export const nextTick = <T>(): Processor<T> => (callback) => (value) => {
  setImmediate(() => callback(value));
};

export const delay = <T>(ms: number): Processor<T> => (callback) => (value) => {
  setTimeout(() => callback(value), ms);
};
