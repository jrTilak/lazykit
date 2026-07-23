import { truncate } from "./truncate";

const label = truncate("A very long label", 10);
// "A very lo…"

const familyLabel = truncate("👨‍👩‍👧‍👦 family account", 10);
// "👨‍👩‍👧‍👦 family …"
