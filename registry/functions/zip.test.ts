import { describe, expect, it } from "bun:test";
import { zip } from "./zip";

describe("zip", () => {
  it("stops at the shortest array by default", () => {
    expect(
      zip([
        [1, 2, 3],
        ["a", "b"],
      ] as const),
    ).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  it("pads to the longest array with undefined when requested", () => {
    expect(
      zip(
        [
          [1, 2, 3],
          ["a", "b"],
        ] as const,
        { mode: "longest" },
      ),
    ).toEqual([
      [1, "a"],
      [2, "b"],
      [3, undefined],
    ]);
  });

  it("handles equal-length and three-way input", () => {
    expect(
      zip([
        [1, 2],
        ["a", "b"],
        [true, false],
      ] as const),
    ).toEqual([
      [1, "a", true],
      [2, "b", false],
    ]);
  });

  it("returns an empty array for no input arrays", () => {
    expect(zip([])).toEqual([]);
  });

  it("stops immediately when any input is empty in shortest mode", () => {
    expect(zip([[1, 2], []] as const)).toEqual([]);
  });

  it("pads empty inputs in longest mode", () => {
    expect(zip([[1, 2], []] as const, { mode: "longest" })).toEqual([
      [1, undefined],
      [2, undefined],
    ]);
  });

  it("wraps values from a single input array", () => {
    expect(zip([[1, 2]] as const)).toEqual([[1], [2]]);
  });

  it("does not mutate any input array", () => {
    const first = [1, 2];
    const second = ["a", "b"];
    zip([first, second]);
    expect(first).toEqual([1, 2]);
    expect(second).toEqual(["a", "b"]);
  });

  it("rejects sparse outer and inner arrays", () => {
    const sparseOuter = Array<readonly number[]>(1);
    const sparseInner = Array<number>(1);
    expect(() => zip(sparseOuter)).toThrow(
      "arrays must not contain empty slots",
    );
    expect(() => zip([sparseInner])).toThrow(
      "input arrays must not contain empty slots",
    );
  });

  it("rejects unsupported modes at runtime", () => {
    expect(() => zip([[1]], { mode: "invalid" as "shortest" })).toThrow(
      "mode must be shortest or longest",
    );
  });
});
