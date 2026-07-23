/** Exchanges an object's own enumerable keys and property-key values. */
export const invert = <Key extends PropertyKey, Value extends PropertyKey>(
  object: Readonly<Record<Key, Value>>
): Record<Value, Key> => {
  const result = Object.create(null) as Record<Value, Key>;
  for (const key of Reflect.ownKeys(object) as Key[]) {
    if (!Object.prototype.propertyIsEnumerable.call(object, key)) continue;
    Reflect.set(result, object[key], key);
  }
  return result;
};
