"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";

const ToggleTheme = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
export default ToggleTheme;
