/**
 * Retrieves a value from local storage with optional parsing and a default return.
 **/
type GetConfig<Value> =
  | {
      defaultParser: boolean;
    }
  | ((storedValue: string) => Value);

const getLocalStorageItem = <Value>(
  key: string,
  defaultValue: Value,
  config: GetConfig<Value> = {
    defaultParser: true,
  }
): Value => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return defaultValue;
  }

  const storedValue = localStorage.getItem(key);
  if (!storedValue) return defaultValue;

  try {
    if (typeof config === "object" && config.defaultParser) {
      return JSON.parse(storedValue) as Value;
    } else if (typeof config === "function") {
      return config(storedValue);
    }
    return storedValue as unknown as Value;
  } catch {
    return defaultValue;
  }
};

export default getLocalStorageItem;
