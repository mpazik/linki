import type { Callback } from "./types";

export * from "./types";
export * from "./filter";
export * from "./async";
export * from "./map";
export * from "./kick";
export * from "./link";
export * from "./provider";
export * from "./state";
export * from "./utils";
export * from "./processor";

export const fork =
  <T = void>(...consumers: Callback<T>[]): Callback<T> =>
  (data) => {
    consumers.forEach((push) => push(data));
  };
