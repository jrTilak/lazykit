import { debounce } from "./debounce";

const search = debounce((query: string) => {
  console.log("Searching for", query);
}, 300);

search("lazy");
search("lazykit");
// After 300ms: Searching for lazykit
