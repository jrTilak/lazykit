type Args = {
  arr: any[][];
  strict?: boolean;
};

const zip = ({ arr, strict = false }: Args): any[][] => {
  const maxIndex = arr.map((a) => a.length).reduce((a, b) => Math.max(a, b), 0);
  const minIndex = arr
    .map((a) => a.length)
    .reduce((a, b) => Math.min(a, b), maxIndex);

  const result: any[][] = [];

  const upto = strict ? minIndex : maxIndex;

  for (let i = 0; i < upto; i++) {
    const zip = arr.map((a) => a[i]);
    result.push(zip);
  }
  return result;
};

export default zip;
