# Click counter example
A simple component that counts click events, and when the enter key is pressed, it sends the total number to save.

```typescript
export const example: Component<
  { onClick: void; onKeyPress: string },
  { saveNumber: number; displayTotal: number }
  > = ({ saveNumber, displayTotal }) => {
  const [triggerSave, setupForSave] = wire(withState(0), saveNumber);

  return {
    onClick: wire(
      throttle(1000),
      reduce(count, 0),
      fork(displayTotal, setupForSave)
    ),
    onKeyPress: wire(
      filter(isKey("Enter")),
      ignoreParam(),
      triggerSave
    ),
  };
};
```

- throttle - enforces a maximum number of times it passes the event downstream; time in this example no more than once per 1000 milliseconds
- reduce - returns its states on each event. It takes the reducer function. In this example, it just counts the number of incoming events.
- filter - pass only an element that matches the setup predicate. In this example, it only passes keyboard event when the "enter" key was pressed
- ignoreParam - ignores the input data but propagates the signal as an output
- withState - a processor that allows to set up state, on trigger the state is propagated to the output, in this example when enter key is pressed it passes the number of clicks on the output
