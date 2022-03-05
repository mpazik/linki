import { newProbe } from "../test";

import { split } from "./filter";
import { link } from "./link";

describe("split", () => {
  test("should split input to correct output channel depending on condition", () => {
    const [positiveNumberListener, getPositiveNumbers] = newProbe<number>();
    const [negativeNumberListener, getNegativeNumbers] = newProbe<number>();

    const splitNumber = link(
      split<number>((it) => it >= 0),
      [positiveNumberListener, negativeNumberListener]
    );

    splitNumber(5);
    splitNumber(-1);

    expect(getPositiveNumbers()).toEqual([5]);
    expect(getNegativeNumbers()).toEqual([-1]);
  });

  test("should split input to correct output channel depending on type", () => {
    const [numberListener, getNumbers] = newProbe<number>();
    const [stringListener, getStrings] = newProbe<string>();

    const splitValue = link(
      split<number, string>(
        (value): value is number => typeof value === "number"
      ),
      [numberListener, stringListener]
    );

    splitValue(5);
    splitValue("test");

    expect(getNumbers()).toEqual([5]);
    expect(getStrings()).toEqual(["test"]);
  });
});
