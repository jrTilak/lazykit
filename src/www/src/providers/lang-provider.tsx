"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "js" | "ts";

const LangContext = createContext<
  | { lang: Lang; setLang: React.Dispatch<React.SetStateAction<Lang>> }
  | undefined
>(undefined);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const lang = localStorage.getItem("code-lang");
    return lang === "js" ? "js" : "ts";
  });

  useEffect(() => {
    localStorage.setItem("code-lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
};
