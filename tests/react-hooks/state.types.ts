import { createRef } from "react";

import { useBoolean } from "../../registry/react-hooks/useBoolean";
import { useControllableState } from "../../registry/react-hooks/useControllableState";
import { useCounter } from "../../registry/react-hooks/useCounter";
import { useEventCallback } from "../../registry/react-hooks/useEventCallback";
import { useHistoryState } from "../../registry/react-hooks/useHistoryState";
import { useList } from "../../registry/react-hooks/useList";
import { useMap } from "../../registry/react-hooks/useMap";
import { useMergedRefs } from "../../registry/react-hooks/useMergedRefs";
import { useObjectState } from "../../registry/react-hooks/useObjectState";
import { usePrevious } from "../../registry/react-hooks/usePrevious";
import { useSet } from "../../registry/react-hooks/useSet";
import { useStep } from "../../registry/react-hooks/useStep";
import { useToggle } from "../../registry/react-hooks/useToggle";

import type { RefCallback } from "react";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;
type Expect<Value extends true> = Value;

declare function callback(
  this: { readonly prefix: string },
  value: number,
  label: string,
): string;

const eventCallback = useEventCallback(callback);
type _EventParameters = Expect<
  Equal<Parameters<typeof eventCallback>, [value: number, label: string]>
>;
type _EventReturn = Expect<Equal<ReturnType<typeof eventCallback>, string>>;
type _EventReceiver = Expect<
  Equal<ThisParameterType<typeof eventCallback>, { readonly prefix: string }>
>;

const genericEventCallback = useEventCallback(
  <Value>(value: Value): Value => value,
);
const genericEventResult = genericEventCallback({ id: 1 });
type _GenericEventResult = Expect<
  Equal<typeof genericEventResult, { id: number }>
>;

interface OverloadedCallback {
  (value: string): string;
  (value: number): number;
}
declare const overloadedCallback: OverloadedCallback;
const stableOverload = useEventCallback(overloadedCallback);
type _EventOverload = Expect<
  Equal<typeof stableOverload, OverloadedCallback>
>;
const _overloadedString: string = stableOverload("ready");
const _overloadedNumber: number = stableOverload(1);

const previous = usePrevious({ id: 1 } as { id: number });
type _Previous = Expect<
  Equal<typeof previous, { id: number } | undefined>
>;
const previousWithInitial = usePrevious("ready", null);
type _PreviousInitial = Expect<
  Equal<typeof previousWithInitial, "ready" | null>
>;

const divRef = createRef<HTMLDivElement>();
const mergedRef: RefCallback<HTMLDivElement> = useMergedRefs(divRef, null);
// @ts-expect-error An SVG ref cannot receive an HTMLDivElement.
useMergedRefs<HTMLDivElement>(divRef, createRef<SVGSVGElement>());

const boolean = useBoolean(true);
const _booleanValue: boolean = boolean.value;
boolean.setValue((value) => !value);
// @ts-expect-error Boolean state cannot be replaced with a number.
boolean.setValue(1);

const toggle = useToggle("open", 0);
type _Toggle = Expect<Equal<typeof toggle.value, "open" | 0>>;
toggle.setValue("open");
toggle.setValue(0);
// @ts-expect-error Only the configured values belong to the toggle.
toggle.setValue("closed");

const firstToggleFunction = () => "first";
const secondToggleFunction = () => "second";
const functionToggle = useToggle(
  firstToggleFunction,
  secondToggleFunction,
);
functionToggle.setValue(() => secondToggleFunction);
// @ts-expect-error Callable values must be returned by an updater.
functionToggle.setValue(secondToggleFunction);

const counter = useCounter(0, { min: -10, max: 10, step: 2 });
const _count: number = counter.count;
counter.increment(3);
counter.setCount((count) => count + 1);
// @ts-expect-error Counter options are numeric.
useCounter(0, { step: "2" });

const steps = useStep(4, { initialStep: 1, loop: true });
const _step: number = steps.currentStep;
steps.setStep((step) => step + 1);
// @ts-expect-error loop is a boolean option.
useStep(4, { loop: "yes" });

const controllable = useControllableState({
  defaultValue: { id: 0 },
  value: { id: 1 },
  onChange(value) {
    const _id: number = value.id;
  },
});
type _Controllable = Expect<
  Equal<typeof controllable.value, { id: number }>
>;
controllable.setValue((value) => ({ id: value.id + 1 }));
// @ts-expect-error The controlled state shape is preserved.
controllable.setValue({ id: "wrong" });

const controllableFunction = useControllableState({
  defaultValue: firstToggleFunction,
});
controllableFunction.setValue(() => secondToggleFunction);
// @ts-expect-error Callable values must be returned by an updater.
controllableFunction.setValue(secondToggleFunction);

const list = useList<{ id: number }>([{ id: 1 }]);
const _items: readonly { id: number }[] = list.items;
list.append({ id: 2 });
list.updateAt(0, (item) => ({ id: item.id + 1 }));
list.move(0, 1);
// @ts-expect-error List items must preserve their item shape.
list.setAt(0, { id: "wrong" });

const map = useMap<string, { active: boolean }>();
const _map: ReadonlyMap<string, { active: boolean }> = map.map;
map.set("job", { active: true });
map.update("job", (value) => ({ active: !(value?.active ?? false) }));
// @ts-expect-error Map values must match the declared value type.
map.set("job", { active: "yes" });

const set = useSet<"read" | "write">(["read"]);
const _set: ReadonlySet<"read" | "write"> = set.set;
set.add("write");
// @ts-expect-error Values outside the Set union are rejected.
set.add("delete");

interface FormState {
  name: string;
  visits?: number;
}

const object = useObjectState<FormState>({ name: "Ada" });
const _object: FormState = object.state;
object.patch({ visits: 2 });
object.setKey("name", "Grace");
object.updateKey("visits", (visits) => (visits ?? 0) + 1);
// @ts-expect-error Unknown object keys cannot be patched.
object.patch({ missing: true });
// @ts-expect-error Key values retain their declared type.
object.setKey("name", 42);
// @ts-expect-error Arrays are not object-state records.
useObjectState([1, 2, 3]);
// @ts-expect-error Callable values are not object-state records.
useObjectState(() => "value");

const history = useHistoryState<{ readonly id: number }>({ id: 1 });
const _history: { readonly id: number } = history.state;
history.setState({ id: 2 });
history.setState((value) => ({ id: value.id + 1 }));
// @ts-expect-error History values retain their declared shape.
history.setState({ id: "wrong" });
// @ts-expect-error maxHistory is numeric.
useHistoryState(0, { maxHistory: "10" });

const functionHistory = useHistoryState(firstToggleFunction);
functionHistory.setState(() => secondToggleFunction);
// @ts-expect-error Callable values must be returned by an updater.
functionHistory.setState(secondToggleFunction);

void mergedRef;
