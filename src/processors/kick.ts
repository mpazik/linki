import type { Processor } from "./processor";

/**
 * Manually invokes next processor with predefined value.
 */
export const kick = <T>(value: T): Processor<T> => (callback) => {
  callback(value);
  return callback;
};
