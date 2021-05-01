import { filter } from "./filter";
import { link } from "./link";
import { map } from "./map";
import { newStaticProvider } from "./provider";

test("link pass value trough multiple processors", () => {
  let value = 0;

  link(
    map((n: number) => n * 2),
    filter((n) => n % 2 === 0),
    (v) => (value = v)
  )(4);

  expect(value).toBe(8);
});

test("link 2", () => {
  let value = 0;

  link(
    newStaticProvider(4),
    map((n: number) => n * 2),
    (v) => (value = v)
  );

  expect(value).toBe(8);
});
