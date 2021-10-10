import type { NamedCallbacks } from "../processors";

export type Component<T extends object = {}, S extends object = {}> = (
  props: NamedCallbacks<S>
) => NamedCallbacks<T>;
