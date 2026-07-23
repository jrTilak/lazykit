import { camelCase } from "../registry/functions/camelCase";
import { downloadBlob } from "../registry/functions/downloadBlob";
import { escapeHtml } from "../registry/functions/escapeHtml";
import { isPlainObject } from "../registry/functions/isPlainObject";
import { joinUrl } from "../registry/functions/joinUrl";
import { kebabCase } from "../registry/functions/kebabCase";
import {
  loadScript,
  type LoadScriptAttributes,
} from "../registry/functions/loadScript";
import {
  orderBy,
  type OrderByRule,
} from "../registry/functions/orderBy";
import { pascalCase } from "../registry/functions/pascalCase";
import { range } from "../registry/functions/range";
import { roundTo } from "../registry/functions/roundTo";
import { sleep } from "../registry/functions/sleep";
import { slugify } from "../registry/functions/slugify";
import { snakeCase } from "../registry/functions/snakeCase";
import {
  sortBy,
  type SortBySelector,
} from "../registry/functions/sortBy";
import { stableStringify } from "../registry/functions/stableStringify";
import { stripIndent } from "../registry/functions/stripIndent";
import { titleCase } from "../registry/functions/titleCase";
import { truncate } from "../registry/functions/truncate";
import { truncateMiddle } from "../registry/functions/truncateMiddle";
import { unescapeHtml } from "../registry/functions/unescapeHtml";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;
type Expect<Value extends true> = Value;

const stringResults = [
  camelCase("hello world"),
  escapeHtml("<p>"),
  joinUrl("https://example.com", "docs"),
  kebabCase("helloWorld"),
  pascalCase("hello world"),
  slugify("Hello world"),
  snakeCase("helloWorld"),
  stripIndent("  value"),
  titleCase("hello world"),
  truncate("hello", 3),
  truncateMiddle("hello", 3),
  unescapeHtml("&lt;p&gt;"),
];
type StringContract = Expect<Equal<(typeof stringResults)[number], string>>;

declare const blob: Blob;
const downloadResult = downloadBlob(blob, "report.txt");
type DownloadContract = Expect<Equal<typeof downloadResult, void>>;
// @ts-expect-error downloadBlob requires a Blob
downloadBlob("content", "report.txt");

declare const unknownValue: unknown;
if (isPlainObject(unknownValue)) {
  const property: unknown = unknownValue.property;
  void property;
}

const attributes: LoadScriptAttributes = {
  integrity: "sha384-value",
  crossorigin: "anonymous",
};
const loadedScript: Promise<HTMLScriptElement> = loadScript(
  "/assets/app.js",
  attributes
);
// @ts-expect-error attribute values must already be strings
loadScript("/assets/app.js", { async: true });

type Row = {
  name: string;
  score: number;
  updatedAt: Date | null;
};
declare const rows: readonly Row[];
const scoreSelector: SortBySelector<Row> = (row) => row.score;
const sortedRows: Row[] = sortBy(
  rows,
  scoreSelector,
  (row) => row.updatedAt
);
const orderRules: readonly OrderByRule<Row>[] = [
  { select: (row) => row.name },
  { select: (row) => row.score, order: "desc" },
];
const orderedRows: Row[] = orderBy(rows, orderRules);
// @ts-expect-error selectors must return a supported, totally ordered value
sortBy(rows, (row) => ({ score: row.score }));
// @ts-expect-error directions are a closed union
orderBy(rows, [{ select: (row) => row.score, order: "sideways" }]);

const values: number[] = range(0, 10, 2);
const rounded: number = roundTo(1.005, 2);
const slept: Promise<void> = sleep(10);
const serialized: string | undefined = stableStringify({ b: 2, a: 1 });

void [
  loadedScript,
  sortedRows,
  orderedRows,
  values,
  rounded,
  slept,
  serialized,
];
