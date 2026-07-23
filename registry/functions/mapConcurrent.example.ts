import { mapConcurrent, type MapConcurrentTransform } from "./mapConcurrent";

const urls = ["/api/first", "/api/second"];

const fetchPage: MapConcurrentTransform<string, string> = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.text();
};

const pages: string[] = await mapConcurrent(urls, 3, fetchPage);
