const remove = <T>(array: T[], index: number | number[]): T[] => {
  const len = array.length;
  if (Array.isArray(index)) {
    // convert negative indices to their positive counterparts
    const indices = index.map((i) => (i < 0 ? len + i : i));
    return array.filter((_, i) => !indices.includes(i));
  }
  index = index < 0 ? len + index : index;
  return array.filter((_, i) => i !== index);
};

export default remove;
