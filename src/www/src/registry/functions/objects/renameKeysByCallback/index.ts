const renameKeysByCallback = <
  T extends Record<string, unknown>,
  R extends Record<string, any>,
>(
  obj: T,
  predicate: (key: keyof T) => string
): R => {
  const newObj: Record<string, any> = { ...obj };

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = predicate(key);
      if (newKey) {
        newObj[newKey] = obj[key]; // Assign the value to the new key
        delete newObj[key]; // Delete the old key
      }
    }
  }

  return newObj as R;
};

export default renameKeysByCallback;
