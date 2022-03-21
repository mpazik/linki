import type { Callback } from "../processors";

export const newProbe = <T = void>(): [
  captureData: Callback<T>,
  getCapturedData: () => T[]
] => {
  let data: T[] = [];
  return [
    (it) => data.push(it),
    () => {
      const lastArgs = data;
      data = [];
      return lastArgs;
    },
  ];
};
