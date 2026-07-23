import { downloadBlob } from "./downloadBlob";

const report = new Blob(["name,total\nAda,42"], { type: "text/csv" });
downloadBlob(report, "report.csv");
