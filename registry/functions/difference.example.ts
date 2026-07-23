import { difference } from "./difference";

const available = difference(["read", "write", "delete"], ["delete"]);
// ["read", "write"]
