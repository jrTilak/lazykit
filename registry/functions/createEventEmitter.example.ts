import { createEventEmitter } from "./createEventEmitter";

type Events = { message: string; progress: number };
const events = createEventEmitter<Events>();
const unsubscribe = events.on("message", console.log);
events.emit("message", "Ready");
unsubscribe();
