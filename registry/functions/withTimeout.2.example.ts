import { withTimeout } from "./withTimeout";

const loadReport = withTimeout(
  async (reportId: string) => fetch(`/api/reports/${reportId}`),
  1_000,
  (reportId) => new Error(`Report ${reportId} took too long`)
);

await loadReport("weekly");
