type AwaitedObject<T extends object> = { -readonly [Key in keyof T]: Awaited<T[Key]> };

/** Resolves an object's own enumerable promise values while preserving its keys. */
export const promiseAllObject = async <T extends object>(object: T): Promise<AwaitedObject<T>> => {
  const result = {} as AwaitedObject<T>;
  const keys = Reflect.ownKeys(object).filter((key) => Object.prototype.propertyIsEnumerable.call(object, key)) as Array<keyof T>;
  const values = await Promise.all(keys.map((key) => object[key]));
  keys.forEach((key, index) => Reflect.defineProperty(result, key, {
    value: values[index],
    enumerable: true,
    configurable: true,
    writable: true,
  }));
  return result;
};
