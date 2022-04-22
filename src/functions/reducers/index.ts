export type Reducer<S, C> = (state: S, change: C) => S;

export const count: Reducer<number, void> = (sum) => sum + 1;

export const sum: Reducer<number, number> = (sum, num) => sum + num;

export const collect =
  <T>(): Reducer<T[], T> =>
  (array, item) => {
    array.push(item);
    return array;
  };

export const merge = <S, C>(state: S, change: C): S => ({
  ...state,
  ...change,
});

export * from "./changers";
