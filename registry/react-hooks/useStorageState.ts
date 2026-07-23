import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type StorageKind = "local" | "session";

export type StorageCodec<Value> = {
  parse: (this: void, storedValue: string) => Value;
  stringify: (this: void, value: Value) => string;
};

export type NonCallable<Value> = Value extends (
  ...args: never[]
) => unknown
  ? never
  : Value;

export type StorageInitialValue<Value> =
  | NonCallable<Value>
  | ((this: void) => Value);

export type StorageStateAction<Value> =
  | NonCallable<Value>
  | ((this: void, previousValue: Value) => Value);

export type StorageStateSetter<Value> = (
  this: void,
  nextValue: StorageStateAction<Value>,
) => void;

export type UseStorageStateOptions<Value> = {
  storage?: StorageKind;
  codec?: StorageCodec<Value>;
  initializeWithValue?: boolean;
  onError?: (this: void, error: unknown) => void;
};

export type UseStorageStateReturn<Value> = {
  value: Value;
  setValue: StorageStateSetter<Value>;
  remove: () => void;
  error: unknown | undefined;
};

type StorageSnapshot<Value> = {
  value: Value;
  error: unknown | undefined;
  notifyError: boolean;
};

type StorageStateEventDetail = {
  storage: StorageKind;
  key: string;
  storedValue: string | null;
};

const storageStateEvent = "lazykit:storage-state";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const getStorage = (kind: StorageKind): Storage =>
  kind === "local" ? window.localStorage : window.sessionStorage;

const jsonCodec: StorageCodec<unknown> = {
  parse: (storedValue) => JSON.parse(storedValue) as unknown,
  stringify: (value) => {
    const storedValue = JSON.stringify(value);
    if (storedValue === undefined) {
      throw new TypeError("value cannot be serialized as JSON");
    }
    return storedValue;
  },
};

const defaultCodec = <Value>(): StorageCodec<Value> =>
  jsonCodec as StorageCodec<Value>;

/**
 * Synchronizes state with localStorage or sessionStorage.
 *
 * The default JSON codec trusts persisted data. Pass a validating codec when
 * values can be written by code outside your control.
 */
export const useStorageState = <Value>(
  key: string,
  initialValue: StorageInitialValue<Value>,
  options: UseStorageStateOptions<Value> = {},
): UseStorageStateReturn<Value> => {
  const kind = options.storage ?? "local";
  const initializeWithValue = options.initializeWithValue ?? true;
  const codec = options.codec ?? defaultCodec<Value>();
  const fallback = useMemo(
    () =>
      typeof initialValue === "function"
        ? Reflect.apply(initialValue as (this: void) => Value, undefined, [])
        : initialValue,
    [key, kind],
  );

  const codecRef = useRef(codec);
  const onErrorRef = useRef(options.onError);

  useIsomorphicLayoutEffect(() => {
    codecRef.current = codec;
    onErrorRef.current = options.onError;
  }, [codec, options.onError]);

  const readStoredValue = useCallback(
    (storedValue?: string | null): StorageSnapshot<Value> => {
      try {
        const raw =
          storedValue === undefined ? getStorage(kind).getItem(key) : storedValue;
        if (raw === null) {
          return { value: fallback, error: undefined, notifyError: false };
        }
        return {
          value: Reflect.apply(codec.parse, undefined, [raw]),
          error: undefined,
          notifyError: false,
        };
      } catch (error) {
        return { value: fallback, error, notifyError: true };
      }
    },
    [codec, fallback, key, kind],
  );

  const [snapshot, setSnapshot] = useState<StorageSnapshot<Value>>(() => {
    if (!initializeWithValue || typeof window === "undefined") {
      return { value: fallback, error: undefined, notifyError: false };
    }
    return readStoredValue();
  });
  const valueRef = useRef(snapshot.value);
  const reportError = useCallback((error: unknown) => {
    const onError = onErrorRef.current;
    if (onError !== undefined) {
      Reflect.apply(onError, undefined, [error]);
    }
  }, []);
  const applySnapshot = useCallback(
    (next: StorageSnapshot<Value>, reportImmediately = false) => {
      valueRef.current = next.value;
      if (reportImmediately && next.error !== undefined) {
        setSnapshot({ ...next, notifyError: false });
        reportError(next.error);
        return;
      }
      setSnapshot(next);
    },
    [reportError],
  );

  useEffect(() => {
    if (snapshot.notifyError && snapshot.error !== undefined) {
      reportError(snapshot.error);
    }
  }, [reportError, snapshot]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    applySnapshot(readStoredValue(), true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) return;

      try {
        if (event.storageArea !== null && event.storageArea !== getStorage(kind)) {
          return;
        }
      } catch (error) {
        applySnapshot(
          { value: fallback, error, notifyError: true },
          true,
        );
        return;
      }

      applySnapshot(readStoredValue(event.newValue), true);
    };

    const handleSameDocumentStorage = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (detail === null || typeof detail !== "object") return;
      const candidate = detail as Partial<StorageStateEventDetail>;
      if (
        (candidate.storage !== "local" && candidate.storage !== "session") ||
        typeof candidate.key !== "string" ||
        (candidate.storedValue !== null &&
          typeof candidate.storedValue !== "string")
      ) {
        return;
      }
      if (candidate.storage !== kind || candidate.key !== key) return;
      applySnapshot(readStoredValue(candidate.storedValue), true);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(storageStateEvent, handleSameDocumentStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(storageStateEvent, handleSameDocumentStorage);
    };
  }, [applySnapshot, fallback, key, kind, readStoredValue]);

  const publish = useCallback(
    (storedValue: string | null) => {
      window.dispatchEvent(
        new CustomEvent<StorageStateEventDetail>(storageStateEvent, {
          detail: { storage: kind, key, storedValue },
        }),
      );
    },
    [key, kind],
  );

  const setValue = useCallback<StorageStateSetter<Value>>(
    (nextValue) => {
      const next =
        typeof nextValue === "function"
          ? Reflect.apply(
              nextValue as (this: void, previousValue: Value) => Value,
              undefined,
              [valueRef.current],
            )
          : nextValue;
      valueRef.current = next;

      let storedValue: string;
      try {
        storedValue = Reflect.apply(codecRef.current.stringify, undefined, [
          next,
        ]);
        getStorage(kind).setItem(key, storedValue);
        applySnapshot({
          value: next,
          error: undefined,
          notifyError: false,
        });
        publish(storedValue);
      } catch (error) {
        applySnapshot({ value: next, error, notifyError: true }, true);
      }
    },
    [applySnapshot, key, kind, publish],
  );

  const remove = useCallback(() => {
    valueRef.current = fallback;

    try {
      getStorage(kind).removeItem(key);
      applySnapshot({
        value: fallback,
        error: undefined,
        notifyError: false,
      });
      publish(null);
    } catch (error) {
      applySnapshot({ value: fallback, error, notifyError: true }, true);
    }
  }, [applySnapshot, fallback, key, kind, publish]);

  return {
    value: snapshot.value,
    setValue,
    remove,
    error: snapshot.error,
  };
};
