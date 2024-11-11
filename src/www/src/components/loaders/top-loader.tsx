"use client";
import NextTopLoader from "nextjs-toploader";

import React from "react";

const TopLoader = () => {
  return (
    <NextTopLoader
      color="#3658A0"
      initialPosition={0.08}
      crawlSpeed={200}
      height={4}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #3658A0,0 0 5px #3658A0"
      zIndex={1600}
    />
  );
};

export default TopLoader;
