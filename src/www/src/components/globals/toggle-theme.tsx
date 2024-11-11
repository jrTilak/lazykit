"use client";

import { Moon, MoonIcon, MoonStarIcon, Sun, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <MoonStarIcon size={20} /> : <SunIcon size={20} />}
    </button>
  );
};
export default ToggleTheme;
