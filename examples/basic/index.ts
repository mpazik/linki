import {
  Component,
  count,
  filter,
  fork,
  ignoreParam,
  link,
  Predicate,
  reduce,
  throttle,
  withState,
} from "../../src";

const isKey = (keyCode: string): Predicate<string> => (code: string) =>
  keyCode === code;

export const example: Component<
  { onClick: void; onKeyPress: string },
  { saveNumber: number; displayTotal: number }
> = ({ saveNumber, displayTotal }) => {
  const [triggerSave, setupForSave] = link(withState(0), saveNumber);

  return {
    onClick: link(
      throttle(1000),
      reduce(count, 0),
      fork(displayTotal, setupForSave)
    ),
    onKeyPress: link(filter(isKey("Enter")), ignoreParam(), triggerSave),
  };
};
