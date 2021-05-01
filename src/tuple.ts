export type Tuple = readonly unknown[];
export type PartialTuple<T> = {
  [K in keyof T]: T[K] | undefined;
};
