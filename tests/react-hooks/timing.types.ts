import { useAsyncTask } from "../../registry/react-hooks/useAsyncTask";
import { useBeforeUnload } from "../../registry/react-hooks/useBeforeUnload";
import { useClipboard } from "../../registry/react-hooks/useClipboard";
import { useCountdown } from "../../registry/react-hooks/useCountdown";
import { useDebouncedCallback } from "../../registry/react-hooks/useDebouncedCallback";
import { useDebouncedValue } from "../../registry/react-hooks/useDebouncedValue";
import { useDocumentTitle } from "../../registry/react-hooks/useDocumentTitle";
import { useIdle } from "../../registry/react-hooks/useIdle";
import { useInterval } from "../../registry/react-hooks/useInterval";
import { useStorageState } from "../../registry/react-hooks/useStorageState";
import { useThrottledCallback } from "../../registry/react-hooks/useThrottledCallback";
import { useThrottledValue } from "../../registry/react-hooks/useThrottledValue";
import { useTimeout } from "../../registry/react-hooks/useTimeout";

import type { StorageCodec } from "../../registry/react-hooks/useStorageState";

const expectType = <Expected>(_value: Expected): void => {};

const TypeContracts = () => {
  const task = useAsyncTask(
    async (_signal, id: number, label: string) => ({ id, label }),
  );
  expectType<Promise<{ id: number; label: string }>>(task.run(1, "one"));
  // @ts-expect-error The task requires a numeric id.
  void task.run("one", "one");
  if (task.state.status === "success") {
    expectType<number>(task.state.data.id);
    expectType<undefined>(task.state.error);
  }
  const tupleTask = useAsyncTask(
    async (_signal, tuple: readonly [id: number, label: string]) => tuple,
  );
  expectType<Promise<readonly [id: number, label: string]>>(
    tupleTask.run([1, "one"]),
  );
  // @ts-expect-error Async tasks are invoked without a receiver.
  useAsyncTask(function (this: { token: string }, _signal: AbortSignal) {
    return this.token;
  });

  const debounced = useDebouncedCallback(
    function (this: { prefix: string }, count: number, enabled: boolean) {
      return `${this.prefix}:${count}:${enabled}`;
    },
    10,
  );
  expectType<void>(debounced.call({ prefix: "item" }, 1, true));
  // @ts-expect-error The second callback argument is boolean.
  debounced(1, "yes");

  const throttled = useThrottledCallback(
    function (this: { factor: number }, value: number) {
      return this.factor * value;
    },
    10,
  );
  expectType<number | undefined>(throttled.call({ factor: 2 }, 4));

  const literal = useDebouncedValue({ state: "ready" as const }, 10);
  expectType<"ready">(literal.state);
  const functionValue = (value: number): string => String(value);
  expectType<typeof functionValue>(useDebouncedValue(functionValue, 10));
  expectType<typeof functionValue>(useThrottledValue(functionValue, 10));
  expectType<readonly [1, 2]>(useThrottledValue([1, 2] as const, 10));

  expectType<void>(useInterval(() => {}, null));
  expectType<boolean>(useTimeout(() => {}, 0).isPending);
  expectType<number>(useCountdown({ from: 3 }).value);
  const receiverCallback = function (this: { token: string }) {
    return this.token;
  };
  // @ts-expect-error Interval callbacks are invoked without a receiver.
  useInterval(receiverCallback, 10);
  // @ts-expect-error Timeout callbacks are invoked without a receiver.
  useTimeout(receiverCallback, 10);
  // @ts-expect-error Countdown callbacks are invoked without a receiver.
  useCountdown({ from: 1, onComplete: receiverCallback });

  type Settings = { theme: "light" | "dark"; density: number };
  const codec: StorageCodec<Settings> = {
    parse: (storedValue) => JSON.parse(storedValue) as Settings,
    stringify: (value) => JSON.stringify(value),
  };
  const stored = useStorageState(
    "settings",
    { theme: "light", density: 1 } satisfies Settings,
    { codec },
  );
  expectType<Settings>(stored.value);
  stored.setValue((value) => ({ ...value, theme: "dark" }));
  // @ts-expect-error The codec and initial state establish Settings.
  stored.setValue({ theme: "blue", density: 1 });

  type StoredHandler = (value: number) => string;
  const storedHandlerValue: StoredHandler = (value) => String(value);
  const handlerCodec: StorageCodec<StoredHandler> = {
    parse: () => storedHandlerValue,
    stringify: () => "handler",
  };
  const storedHandler = useStorageState<StoredHandler>(
    "handler",
    () => storedHandlerValue,
    { codec: handlerCodec },
  );
  expectType<StoredHandler>(storedHandler.value);
  storedHandler.setValue(() => storedHandlerValue);
  // @ts-expect-error Callable values must be returned by an updater wrapper.
  storedHandler.setValue(storedHandlerValue);
  // @ts-expect-error Callable initial values must be returned by a lazy wrapper.
  useStorageState<StoredHandler>("handler", storedHandlerValue, {
    codec: handlerCodec,
  });

  const clipboard = useClipboard();
  expectType<Promise<void>>(clipboard.copy("text"));
  // @ts-expect-error Clipboard actions are receiverless.
  clipboard.copy.call({ token: "invalid" }, "text");
  expectType<boolean>(useIdle(100).isIdle);
  // @ts-expect-error Idle callbacks are invoked without a receiver.
  useIdle(100, { onIdle: receiverCallback });
  expectType<void>(useDocumentTitle("Page"));
  expectType<void>(useBeforeUnload(() => true));
  // @ts-expect-error Before-unload predicates are invoked without a receiver.
  useBeforeUnload(receiverCallback);

  return null;
};

void TypeContracts;
