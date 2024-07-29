const sampleObj = (...keys: string[]) => {
  const obj: any = {};
  keys.forEach((key) => {
    obj[key] = Math.random();
  });
  return obj as Record<string, number>;
};

export default sampleObj;
