export const newProbe = <T>(): [
  captureData: (it: T) => void,
  getCapturedData: () => T[]
] => {
  let data: T[] = [];
  return [
    (it) => data.push(it),
    () => {
      const lastArgs = data;
      data = [];
      return lastArgs;
    },
  ];
};
