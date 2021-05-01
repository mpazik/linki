import { Callback } from "./types";

export type Provider<T> = (callback: Callback<T>) => void;

export type ClosableProvider<T> = (callback: Callback<T>) => Callback;

export const newStaticProvider = <T>(value: T): Provider<T> => (callback) =>
  callback(value);
