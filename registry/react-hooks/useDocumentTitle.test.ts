import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { StrictMode } from "react";

import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  it("updates across rerenders and restores the original title", () => {
    document.title = "Original";
    const { rerender, unmount } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: "First" as string | null } },
    );
    expect(document.title).toBe("First");
    rerender({ title: "Second" });
    expect(document.title).toBe("Second");
    unmount();
    expect(document.title).toBe("Original");
  });

  it("supports disabled updates and retaining the final title", () => {
    document.title = "Original";
    const { rerender, unmount } = renderHook(
      ({ title }) =>
        useDocumentTitle(title, { restoreOnUnmount: false }),
      {
        initialProps: { title: null as string | null },
        wrapper: StrictMode,
      },
    );
    expect(document.title).toBe("Original");
    rerender({ title: "Kept" });
    expect(document.title).toBe("Kept");
    unmount();
    expect(document.title).toBe("Kept");
  });

  it("removes an explicitly disabled title even when unmount retention is off", () => {
    document.title = "Original";
    const { rerender, unmount } = renderHook(
      ({ title }) =>
        useDocumentTitle(title, { restoreOnUnmount: false }),
      { initialProps: { title: "Kept" as string | null } },
    );

    expect(document.title).toBe("Kept");
    rerender({ title: null });
    expect(document.title).toBe("Original");
    unmount();
    expect(document.title).toBe("Original");
  });

  it("keeps the newest owner when instances unmount out of order", () => {
    document.title = "Original";
    const first = renderHook(() => useDocumentTitle("First"));
    const second = renderHook(() => useDocumentTitle("Second"));

    expect(document.title).toBe("Second");
    first.unmount();
    expect(document.title).toBe("Second");
    second.unmount();
    expect(document.title).toBe("Original");
  });

  it("treats the latest title update as the active owner", () => {
    document.title = "Original";
    const first = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: "First" } },
    );
    const second = renderHook(() => useDocumentTitle("Second"));

    first.rerender({ title: "Updated first" });
    expect(document.title).toBe("Updated first");
    second.unmount();
    expect(document.title).toBe("Updated first");
    first.unmount();
    expect(document.title).toBe("Original");
  });

  it("retains non-restoring title layers beneath and above other owners", () => {
    document.title = "Original";
    const retainedBelow = renderHook(() =>
      useDocumentTitle("Retained below", { restoreOnUnmount: false }),
    );
    const temporaryAbove = renderHook(() => useDocumentTitle("Temporary"));

    retainedBelow.unmount();
    expect(document.title).toBe("Temporary");
    temporaryAbove.unmount();
    expect(document.title).toBe("Retained below");

    const temporaryBelow = renderHook(() => useDocumentTitle("Below"));
    const retainedAbove = renderHook(() =>
      useDocumentTitle("Retained above", { restoreOnUnmount: false }),
    );
    retainedAbove.unmount();
    expect(document.title).toBe("Retained above");
    temporaryBelow.unmount();
    expect(document.title).toBe("Retained above");
  });
});
