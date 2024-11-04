import React from "react";

export interface IRegistryJSON {
  name: string;
  code: {
    ts: string;
    js: string;
  };
  examples: Record<
    string,
    {
      component: React.LazyExoticComponent<() => React.ReactElement>;
      code: {
        tsx: string;
      };
    }
  >;
  category: string;
  type: string;
}

export interface IDoc {
  desc: string;
  externalLinks?: {
    label: string;
    url: string;
  }[];
}

export interface INavLink {
  heading: string;
  links?: {
    label: string;
    url: string;
  }[];
  categories?: {
    label: string;
    url: string;
    methods: {
      label: string;
      url: string;
    }[];
  }[];
}

export interface INavLinkForPrevNextButton {
  label: string;
  url: string;
}
