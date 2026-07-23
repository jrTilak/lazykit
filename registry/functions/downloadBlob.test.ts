import { afterEach, describe, expect, it, mock } from "bun:test";
import { downloadBlob } from "./downloadBlob";

describe("downloadBlob", () => {
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;

  afterEach(() => {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
    document.body.innerHTML = "";
  });

  it("clicks a temporary anchor and releases the URL", () => {
    const create = mock(() => "blob:test");
    const revoke = mock(() => {});
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
    const click = mock(() => {});
    const original = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = click;
    try {
      const blob = new Blob(["hello"]);
      downloadBlob(blob, "hello.txt");
      expect(create).toHaveBeenCalledWith(blob);
      expect(click).toHaveBeenCalledTimes(1);
      expect(revoke).toHaveBeenCalledWith("blob:test");
      expect(document.querySelector("a")).toBeNull();
    } finally {
      HTMLAnchorElement.prototype.click = original;
    }
  });

  it("rejects blank filenames before creating a URL", () => {
    URL.createObjectURL = mock(() => "blob:test");
    expect(() => downloadBlob(new Blob(), "  ")).toThrow(TypeError);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
