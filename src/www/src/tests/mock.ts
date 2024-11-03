export const mockStorage = (name: "localStorage" | "sessionStorage"): void => {
  class StorageMock implements Omit<Storage, "key" | "length"> {
    store: Record<string, string> = {};

    clear() {
      this.store = {};
    }

    getItem(key: string) {
      return this.store[key] || null;
    }

    setItem(key: string, value: unknown) {
      this.store[key] = value + "";
    }

    removeItem(key: string) {
      delete this.store[key];
    }
  }

  Object.defineProperty(window, name, {
    value: new StorageMock(),
  });
};
