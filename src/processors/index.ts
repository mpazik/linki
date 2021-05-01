import { Callback } from "./types";

export * from "./types";
export * from "./filter";
export * from "./async";
export * from "./map";
export * from "./link";
export * from "./provider";
export * from "./reduce";
export * from "./utils";

export const fork = <T = void>(...consumers: Callback<T>[]): Callback<T> => (
  data
) => {
  consumers.forEach((push) => push(data));
};
