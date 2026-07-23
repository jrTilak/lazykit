import { formatBytes } from "./formatBytes";

formatBytes(1_500);
// "1.5 kB"

formatBytes(1_536, { binary: true });
// "1.5 KiB"
