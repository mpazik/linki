import type { Callback, Close } from "./types";

export type Provider<T> = (callback: Callback<T>) => void;

export type ClosableProvider<T> = (callback: Callback<T>) => Close;

export const newStaticProvider =
  <T>(value: T): Provider<T> =>
  (callback) =>
    callback(value);
