"use client";

import { AlignJustify } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ToggleSidebarButton = () => {
  const pathname = usePathname();
  const onClick = () => {
    document.querySelector("#sidebar")?.classList.toggle("-translate-x-full");
  };
  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.querySelector("#sidebar")?.classList.add("-translate-x-full");
    }
  }, [pathname]);
  return (
    <button onClick={onClick} className="lg:hidden">
      <AlignJustify
        style={{
          marginRight: "1rem",
          height: "1.5rem",
          width: "1.5rem",
        }}
      />
    </button>
  );
};
export default ToggleSidebarButton;
