import { intersection } from "./intersection";

const shared = intersection(["read", "write"], ["write", "delete"]);
// ["write"]
