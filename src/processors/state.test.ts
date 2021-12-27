import { newProbe } from "../test";

import { link } from "./link";
import { combine, reduce, withOptionalState, withState } from "./state";

const add = (a: number, b: number): number => a + b;

describe("reduce", () => {
  test("for each message should pass new state", () => {
    const [listener, getResults] = newProbe<number>();

    const addNextNumber = reduce<number, number>(add, 10)(listener);

    addNextNumber(5);
    addNextNumber(2);

    expect(getResults()).toEqual([15, 17]);
  });
});

describe("combine", () => {
  test("for each update of single state should pass new combined state", () => {
    const [listener, getResults] = newProbe<[number, string]>();

    const [changeNumber, changeString] = combine(10, "test")(listener);

    changeNumber(15);
    expect(getResults()).toEqual([[15, "test"]]);

    changeNumber(20);
    expect(getResults()).toEqual([[20, "test"]]);

    changeString("hey");
    expect(getResults()).toEqual([[20, "hey"]]);

    changeNumber(30);
    expect(getResults()).toEqual([[30, "hey"]]);
  });
});

describe("withState", () => {
  test("does pass a message with current state each time signal is sent", () => {
    const [listener, getResults] = newProbe<number>();

    const [trigger, update] = link(withState(10), listener);

    trigger();
    trigger();
    update(20);
    trigger();

    expect(getResults()).toEqual([10, 10, 20]);
  });

  test("does pass a message with current state and value each time value is sent", () => {
    const [listener, getResults] = newProbe<number>();

    const [trigger, update] = link(withState(10), listener);

    trigger();
    trigger();
    update(20);
    trigger();

    expect(getResults()).toEqual([10, 10, 20]);
  });

  test("does not pass a message when the state have changed", () => {
    const [listener, getResults] = newProbe<number>();

    const [, update] = link(withState(10), listener);

    update(20);
    update(30);

    expect(getResults()).toEqual([]);
  });
});

describe("withOptionalState", () => {
  test("does pass a message with current state each time signal is sent", () => {
    const [listener, getResults] = newProbe<number>();

    const [trigger, update] = link(withOptionalState(10), listener);

    trigger();
    trigger();
    update(20);
    trigger();

    expect(getResults()).toEqual([10, 10, 20]);
  });

  test("does not pass a message when state have changed", () => {
    const [listener, getResults] = newProbe<number>();

    const [, update] = link(withOptionalState(10), listener);

    update(20);
    update(30);
    expect(getResults()).toEqual([]);
  });

  test("does not pass a message when state was not defined", () => {
    const [listener, getResults] = newProbe<number>();

    const [trigger, update] = link(withOptionalState<number>(), listener);

    trigger();
    trigger();
    update(20);
    trigger();

    expect(getResults()).toEqual([20]);
  });

  test("does not pass a message when state was reset", () => {
    const [listener, getResults] = newProbe<number>();

    const [trigger, , reset] = link(withOptionalState<number>(10), listener);

    reset();
    trigger();

    expect(getResults()).toEqual([]);
  });

  test("does pass a message when when undefined is a valid type", () => {
    const [listener, getResults] = newProbe<number | undefined>();

    const [trigger] = link(
      withOptionalState<number | undefined>(undefined),
      listener
    );

    trigger();

    expect(getResults()).toEqual([undefined]);
  });
});
