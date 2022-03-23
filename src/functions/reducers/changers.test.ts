import type {
  BooleanChange,
  ArrayChange,
  MapChange,
  ObjectChange,
} from "./changers";
import {
  booleanChanger,
  arrayChanger,
  mapChanger,
  objectChanger,
  setToChanger,
} from "./changers";

describe("setToChanger", () => {
  test("sets value", () => {
    expect(setToChanger<number>()(5, ["to", 4])).toEqual(4);
  });
});

describe("booleanChanger", () => {
  const check = (
    state: boolean,
    change: BooleanChange,
    expected: boolean
  ) => () => {
    expect(booleanChanger()(state, change)).toEqual(expected);
  };

  test("toggle from false to true", check(false, ["tgl"], true));
  test("toggle from true to false", check(true, ["tgl"], false));
  test("sets value to something different", check(true, ["to", false], false));
  test("sets value to same", check(false, ["to", false], false));
});

describe("objectChanger", () => {
  const check = <T>(state: T, change: ObjectChange<T>, expected: T) => () => {
    expect(objectChanger<T>()(state, change)).toEqual(expected);
  };
  const state = () => ({ test: "text", value: 5 });

  test(
    "sets value",
    check(state(), ["to", { test: "text", value: 2 }], {
      test: "text",
      value: 2,
    })
  );

  test(
    "sets value of property",
    check(state(), ["set", "value", 3], {
      test: "text",
      value: 3,
    })
  );
});

type ListItem = [number, string];
type List = ListItem[];

describe("listChanger", () => {
  const check = (
    state: List,
    change: ArrayChange<ListItem, number>,
    expected: List
  ) => () => {
    expect(arrayChanger((item: ListItem) => item[0])(state, change)).toEqual(
      expected
    );
  };
  const state = (): List => [
    [1, "first"],
    [2, "second"],
  ];

  test("sets value", check(state(), ["to", [[0, "zero"]]], [[0, "zero"]]));
  test(
    "sets existing items into an array by updating it",
    check(
      state(),
      ["set", [1, "one"]],
      [
        [1, "one"],
        [2, "second"],
      ]
    )
  );
  test(
    "sets new item into an array if it didn't exists previously",
    check(
      state(),
      ["set", [3, "third"]],
      [
        [1, "first"],
        [2, "second"],
        [3, "third"],
      ]
    )
  );
  test(
    "deletes item from an array",
    check(state(), ["del", 1], [[2, "second"]])
  );
});

describe("mapChanger", () => {
  const check = <K, V>(
    state: Map<K, V>,
    change: MapChange<K, V>,
    expected: Map<K, V>
  ) => () => {
    expect(mapChanger()(state, change)).toEqual(expected);
  };
  const state = (): Map<number, string> =>
    new Map([
      [1, "first"],
      [2, "second"],
    ]);

  test(
    "sets value",
    check(state(), ["to", new Map([[0, "zero"]])], new Map([[0, "zero"]]))
  );
  test(
    "sets existing items into an array by updating it",
    check(
      state(),
      ["set", 1, "one"],
      new Map([
        [1, "one"],
        [2, "second"],
      ])
    )
  );
  test(
    "sets new item into an array if it didn't exists previously",
    check(
      state(),
      ["set", 3, "third"],
      new Map([
        [1, "first"],
        [2, "second"],
        [3, "third"],
      ])
    )
  );
  test(
    "deletes item from an array",
    check(state(), ["del", 1], new Map([[2, "second"]]))
  );
});
