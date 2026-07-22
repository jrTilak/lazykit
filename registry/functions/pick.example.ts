import { pick } from "./pick";

const userSettings = {
  theme: "light",
  language: "fr",
  notifications: false,
  location: "Canada",
};

const selectedSettings = pick(userSettings, ["theme", "language"]);

console.log(selectedSettings);
// Output: { theme: "light", language: "fr" }
