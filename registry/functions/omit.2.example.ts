import { omit } from "./omit";

const settings = {
  theme: "dark",
  notifications: true,
  language: "en",
  fontSize: 16,
  preferredColor: {
    primary: "blue",
    secondary: "green",
  }
};

const updatedSettings = omit(settings, ["theme", "fontSize", ]);

console.log(updatedSettings);
// Output: { notifications: true, language: "en" }
