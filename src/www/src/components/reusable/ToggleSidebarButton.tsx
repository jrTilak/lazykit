"use client";

import { AlignJustify } from "lucide-react";

const ToggleSidebarButton = () => {
  return (
    <button
      onClick={() => {
        document
          .querySelector("#sidebar")
          ?.classList.toggle("-translate-x-full");
      }}
      className="lg:hidden"
    >
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
