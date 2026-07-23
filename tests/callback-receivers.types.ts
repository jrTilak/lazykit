import { countBy } from "../registry/functions/countBy";
import { differenceBy } from "../registry/functions/differenceBy";
import { filterObject } from "../registry/functions/filterObject";
import { intersectionBy } from "../registry/functions/intersectionBy";
import { keyBy } from "../registry/functions/keyBy";
import { mapKeys } from "../registry/functions/mapKeys";
import { mapObject } from "../registry/functions/mapObject";
import { maxBy } from "../registry/functions/maxBy";
import { minBy } from "../registry/functions/minBy";
import { orderBy } from "../registry/functions/orderBy";
import { partition } from "../registry/functions/partition";
import { shuffle } from "../registry/functions/shuffle";
import { sortBy } from "../registry/functions/sortBy";
import { sumBy } from "../registry/functions/sumBy";
import { unionBy } from "../registry/functions/unionBy";
import { uniqueBy } from "../registry/functions/uniqueBy";

type Receiver = { offset: number };

// @ts-expect-error selectors are invoked without a receiver
countBy([1], function (this: Receiver, value) {
  return String(value + this.offset);
});

// @ts-expect-error selectors are invoked without a receiver
keyBy([1], function (this: Receiver, value) {
  return String(value + this.offset);
});

// @ts-expect-error selectors are invoked without a receiver
differenceBy([1], [[2]], function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error selectors are invoked without a receiver
intersectionBy([1], [[2]], function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error selectors are invoked without a receiver
maxBy([1], function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error selectors are invoked without a receiver
minBy([1], function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error selectors are invoked without a receiver
sortBy([1], function (this: Receiver, value) {
  return value + this.offset;
});

orderBy(
  [1],
  [
    {
      // @ts-expect-error selectors are invoked without a receiver
      select: function (this: Receiver, value) {
        return value + this.offset;
      },
    },
  ]
);

// @ts-expect-error predicates are invoked without a receiver
partition([1], function (this: Receiver, value) {
  return value > this.offset;
});

// @ts-expect-error selectors are invoked without a receiver
sumBy([1], function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error selectors are invoked without a receiver
unionBy([[1]], function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error selectors are invoked without a receiver
uniqueBy([1], function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error transforms are invoked without a receiver
mapKeys({ value: 1 }, function (this: Receiver, value) {
  return String(value + this.offset);
});

// @ts-expect-error predicates are invoked without a receiver
filterObject({ value: 1 }, function (this: Receiver, value) {
  return value > this.offset;
});

// @ts-expect-error transforms are invoked without a receiver
mapObject({ value: 1 }, function (this: Receiver, value) {
  return value + this.offset;
});

// @ts-expect-error random sources are invoked without a receiver
shuffle([1], function (this: Receiver) {
  return this.offset;
});
