import { Transformer } from "../functions";

import { Processor } from "./types";

export const toTransformer = <T, S>(
  p: Processor<T, S>
): Transformer<T, S | undefined> => {
  return (v) => {
    let value: S | undefined;
    let returned = false;
    p((v) => {
      if (returned) {
        throw new Error(
          "Only synchronous processor can be used to create Transformer"
        );
      }
      value = v;
    })(v);
    returned = true;
    return (value as unknown) as S;
  };
};
