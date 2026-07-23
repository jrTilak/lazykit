import { memoize } from "../registry/functions/memoize";
import { withCallCount } from "../registry/functions/withCallCount";

const callable = Object.assign(<Value>(value: Value) => value, {
  label: "identity" as const,
});

const memoized = memoize(callable);
const memoizedLabel: "identity" = memoized.label;
const memoizedLiteral: "ready" = memoized("ready" as const);

const counted = withCallCount(callable);
const countedLabel: "identity" = counted.label;
const countedLiteral: 1 = counted(1 as const);

declare const clearCollision: ((value: number) => number) & {
  clear?: () => void;
};
// @ts-expect-error memoize reserves clear for its cache control
memoize(clearCollision);

declare const countCollision: ((value: number) => number) & {
  getCallCount?: () => number;
};
// @ts-expect-error withCallCount reserves both count-control names
withCallCount(countCollision);

void [
  memoizedLabel,
  memoizedLiteral,
  countedLabel,
  countedLiteral,
];
