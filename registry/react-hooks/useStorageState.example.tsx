import { useStorageState } from "./useStorageState";

import type { StorageCodec } from "./useStorageState";

type Preference = "light" | "dark";

const preferenceCodec: StorageCodec<Preference> = {
  parse: (storedValue) => {
    if (storedValue !== "light" && storedValue !== "dark") {
      throw new TypeError("Invalid preference");
    }
    return storedValue;
  },
  stringify: (value) => value,
};

export const ThemePreference = () => {
  const preference = useStorageState<Preference>("theme", "light", {
    codec: preferenceCodec,
  });

  return (
    <button
      type="button"
      onClick={() =>
        preference.setValue((value) => (value === "light" ? "dark" : "light"))
      }
    >
      Theme: {preference.value}
    </button>
  );
};
