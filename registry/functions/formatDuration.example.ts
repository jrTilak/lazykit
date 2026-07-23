import { formatDuration } from "./formatDuration";

formatDuration(90_500);
// "1 m 30 s"

formatDuration(90_500, { maxUnits: 3 });
// "1 m 30 s 500 ms"
