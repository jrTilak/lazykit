type Config<Value> =
  | {
      defaultParser: boolean;
    }
  | ((value: Value) => string);

const setLocalStorageItem = <Value>(
  key: string,
  value: unknown,
  config: Config<Value> = {
    defaultParser: true,
  }
): boolean => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return false;
  }

  try {
    let parsed: string = "";
    if (typeof config === "object" && config.defaultParser) {
      if (typeof value === "object" || Array.isArray(value)) {
        parsed = JSON.stringify(value);
      } else {
        parsed = value as string;
      }
    } else if (typeof config === "function") {
      parsed = config(value as Value);
    } else {
      parsed = value as string;
    }
    localStorage.setItem(key, parsed);
    return true;
  } catch {
    return false;
  }
};

export default setLocalStorageItem;
