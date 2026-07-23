import { promiseAllObject } from "./promiseAllObject";

const data = await promiseAllObject({
  user: fetch("/api/user").then((response) => response.json()),
  settings: fetch("/api/settings").then((response) => response.json()),
  requestedAt: new Date().toISOString(),
});
