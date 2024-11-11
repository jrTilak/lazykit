import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useClickAnywhere from ".";

describe("useClickAnywhere", () => {
  it("should trigger callback when clicking outside the ignored elements", () => {
    const callback = vi.fn();
    const ref1 = { current: document.createElement("div") };
    const ref2 = { current: document.createElement("div") };

    document.body.appendChild(ref1.current); // Add elements to the document for testing
    document.body.appendChild(ref2.current);

    const { result } = renderHook(() =>
      useClickAnywhere(callback, true, [ref1, ref2])
    );

    const outsideClickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    // Simulate click outside the refs
    act(() => {
      document.body.dispatchEvent(outsideClickEvent);
    });

    expect(callback).toHaveBeenCalledTimes(1); // Callback should be called once

    // Clean up DOM
    document.body.removeChild(ref1.current);
    document.body.removeChild(ref2.current);
  });

  it("should not trigger callback if the click is inside one of the ignored elements", () => {
    const callback = vi.fn();
    const ref1 = { current: document.createElement("div") };
    const ref2 = { current: document.createElement("div") };

    document.body.appendChild(ref1.current);
    document.body.appendChild(ref2.current);

    const { result } = renderHook(() =>
      useClickAnywhere(callback, true, [ref1, ref2])
    );

    // Simulate click inside the ignored element
    act(() => {
      ref1.current.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(callback).toHaveBeenCalledTimes(0); // Callback should not be called
    // Clean up DOM
    document.body.removeChild(ref1.current);
    document.body.removeChild(ref2.current);
  });

  it("should not trigger callback when disabled", () => {
    const callback = vi.fn();
    const ref1 = { current: document.createElement("div") };

    document.body.appendChild(ref1.current);

    const { result } = renderHook(() =>
      useClickAnywhere(callback, true, [ref1])
    );

    // Disable the listener
    act(() => {
      result.current.disable();
    });

    // Simulate click outside the ignored element
    act(() => {
      document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(callback).toHaveBeenCalledTimes(0); // Callback should not be called

    // Clean up DOM
    document.body.removeChild(ref1.current);
  });

  it("should trigger callback when re-enabled", () => {
    const callback = vi.fn();
    const ref1 = { current: document.createElement("div") };

    document.body.appendChild(ref1.current);

    const { result } = renderHook(() =>
      useClickAnywhere(callback, false, [ref1])
    );

    // Simulate click outside the ignored element while disabled
    act(() => {
      document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(callback).toHaveBeenCalledTimes(0); // Callback should not be called

    // Re-enable the listener
    act(() => {
      result.current.enable();
    });

    // Simulate click outside the ignored element now that it's enabled
    act(() => {
      document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(callback).toHaveBeenCalledTimes(1); // Callback should now be called

    // Clean up DOM
    document.body.removeChild(ref1.current);
  });
});
