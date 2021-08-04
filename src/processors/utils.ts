import { Transformer } from "../functions";

import { Processor, ProcessorMultiOut } from "./processor";
import { Callback } from "./types";

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
  onSecond: Callback<S2>
): Processor<T, S1> => (callback) => p([callback, onSecond]);

export const logger = <T>(name: string): Processor<T, T> => (callback) => (
  value
) => {
  console.log(name, value);
  callback(value);
};
