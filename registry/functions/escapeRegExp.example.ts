import { escapeRegExp } from "./escapeRegExp";

const query = "file.ts?";
const matcher = new RegExp(escapeRegExp(query));
