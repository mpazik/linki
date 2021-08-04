import { Tuple } from "../tuple";

export type Callback<T = void> = (value: T) => void;
export type Callbacks<T extends Tuple> = {
  [K in keyof T]: Callback<T[K]>;
};
export type NamedCallbacks<T extends object> = {
  [K in keyof T]: Callback<T[K]>;
};

export type Close = () => void;
