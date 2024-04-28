import { create } from "zustand";

interface langState {
  lang: "js" | "ts";
  setLang: (lang: "js" | "ts") => void;
}

const useLang = create<langState>()((set) => ({
  lang: localStorage.getItem("code-lang") === "js" ? "js" : "ts",
  setLang: (lang) => {
    localStorage.setItem("code-lang", lang);
    set((state) => ({ lang }));
  },
}));

export default useLang;
export type Lang = langState["lang"];
