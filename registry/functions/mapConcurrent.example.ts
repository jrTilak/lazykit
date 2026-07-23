import { mapConcurrent } from "./mapConcurrent";

const urls = ["/api/first", "/api/second"];

const pages = await mapConcurrent(urls, 3, async (url) => {
  const response = await fetch(url);
  return response.text();
});
