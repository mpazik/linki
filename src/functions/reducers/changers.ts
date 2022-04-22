import type { Reducer } from "./";

// A set of reducers that can modify its internal state which is in shape of common JS structure
// The API is experimental

export type SetToChange<T> = [op: "to", value: T];
export const setToChanger =
  <T>(): Reducer<T, SetToChange<T>> =>
  (state, op) => {
    switch (op[0]) {
      case "to": {
        return op[1];
      }
    }
  };

export type BooleanChange = SetToChange<boolean> | [op: "tgl"];
export const booleanChanger =
  (): Reducer<boolean, BooleanChange> => (state, op) => {
    switch (op[0]) {
      case "to": {
        return op[1];
      }
      case "tgl": {
        return !state;
      }
    }
  };

export type ObjectChange<T> =
  | SetToChange<T>
  | [op: "set", key: keyof T, value: T[keyof T]];

export const objectChanger =
  <T>(): Reducer<T, ObjectChange<T>> =>
  (state, op) => {
    switch (op[0]) {
      case "to": {
        return op[1];
      }
      case "set": {
        const [, key, value] = op;
        state[key] = value;
        return state;
      }
    }
  };

export type ArrayChange<I, ID> =
  | SetToChange<I[]>
  | [op: "set", item: I]
  | [op: "del", id: ID];

export const arrayChanger =
  <I, ID>(getId: (item: I) => ID): Reducer<I[], ArrayChange<I, ID>> =>
  (state, op) => {
    const findIndex = (id: ID) => state.findIndex((it) => getId(it) === id);
    switch (op[0]) {
      case "to": {
        return op[1];
      }
      case "set": {
        const [, item] = op;
        const i = findIndex(getId(item));
        if (i >= 0) {
          state[i] = item;
        } else {
          state.push(item);
        }
        return state;
      }
      case "del": {
        const id = op[1];
        const i = findIndex(id);
        if (i >= 0) {
          state.splice(i, 1);
        }
        return state;
      }
    }
  };

export type MapChange<K, V> =
  | SetToChange<Map<K, V>>
  | [op: "set", key: K, value: V]
  | [op: "del", key: K];

export const mapChanger =
  <K, V>(): Reducer<Map<K, V>, MapChange<K, V>> =>
  (state, op) => {
    switch (op[0]) {
      case "to": {
        return op[1];
      }
      case "set": {
        const [, key, value] = op;
        state.set(key, value);
        return state;
      }
      case "del": {
        const key = op[1];
        if (state.has(key)) {
          state.delete(key);
        }
        return state;
      }
    }
  };
