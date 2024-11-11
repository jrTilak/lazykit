export const getLocalStorage = <T>(
  key: string,
  defaultValue: T,
  config?: Partial<{
    parse: boolean;
  }>
): T => {
  // Check if window is defined
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return defaultValue;
  } else {
    const val = localStorage.getItem(key);

    if (config?.parse) {
      try {
        return (val ? JSON.parse(val) : defaultValue) as T;
      } catch (err) {
        console.error("Error parsing JSON from localStorage", err);
      }
    }

    return (val as T) ?? defaultValue; // Return default value if val is null or undefined
  }
};

export const setLocalStorage = (
  key: string,
  value: any,
  config?: Partial<{
    parse: boolean;
  }>
) => {
  // Check if window is defined
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return;
  } else {
    let val: string;
    if (config?.parse) {
      try {
        val = JSON.stringify(value);
      } catch (err) {
        console.error("Error stringifying value for localStorage", err);
        val = String(value); // fallback to string if JSON.stringify fails
      }
    } else {
      val = String(value); // ensure value is a string
    }

    localStorage.setItem(key, val);
  }
};
