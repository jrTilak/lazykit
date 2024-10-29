type Args<T extends Array<Array<unknown>>> = {
  arr: T;
  strict?: boolean;
};

const zip = <T extends Array<Array<unknown>>>({
  arr,
  strict = false,
}: Args<T>): T => {
  const maxIndex = arr.map((a) => a.length).reduce((a, b) => Math.max(a, b), 0);
  const minIndex = arr
    .map((a) => a.length)
    .reduce((a, b) => Math.min(a, b), maxIndex);

  let result = [] as unknown[][];

  const upto = strict ? minIndex : maxIndex;

  for (let i = 0; i < upto; i++) {
    const zip = arr.map((a) => a[i]);
    result.push(zip);
  }

  return result as T;
};

export default zip;
