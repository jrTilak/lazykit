import { stableStringify } from "./stableStringify";

const cacheKey = stableStringify({
  filters: { status: "active", role: "admin" },
  page: 1
});
