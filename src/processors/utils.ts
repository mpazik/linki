import type { Transformer } from "../functions";

import type { Processor, ProcessorMultiOut } from "./processor";
import type { Callback } from "./types";

export const triggerEffect = <T>(handler: (data: T) => void): Processor<T> => (
  callback
) => (data) => {
  handler(data);
  callback(data);
};

export const logIt = <T>(name = "🧐 ㏒: "): Processor<T, T> =>
  triggerEffect((data) => console.info(name, data));

export const logAsError = <T>(name?: string): Processor<T, T> =>
  triggerEffect(
    name ? (data) => console.error(name, data) : (data) => console.error(data)
  );

export const toTransformer = <T, S>(
  p: Processor<T, S>
): Transformer<T, S | undefined> => {
  return (v) => {
    let value: S | undefined;
    let returned = false;
    p((v) => {
      if (returned) {
        throw new Error(
          "Only synchronous processor can be used to create Transformer"
        );
      }
      value = v;
    })(v);
    returned = true;
    return (value as unknown) as S;
  };
};

export const onSecondOutput = <T, S1, S2>(
  p: ProcessorMultiOut<T, [S1, S2]>,
  handler: Callback<S2>
): Processor<T, S1> => (callback) => p([callback, handler]);

export const withErrorLogging = <I, O>(
  p: ProcessorMultiOut<I, [O, unknown]>
): Processor<I, O> => onSecondOutput(p, (e) => console.error(e));
