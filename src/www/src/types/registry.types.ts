export interface IRegistryJSON {
  name: string;
  code: {
    ts: string;
    js: string;
  };
  createdAt: {
    date: string;
    packageVersion: string;
  };
  lastUpdated: {
    date: string;
    packageVersion: string;
  };
  category: string;
  type: string;
  examples: {
    js: string;
    ts: string;
  }[];
  docs: {
    metaData: IDoc;
    md: string;
  };
  props: IRegistryFunctionPropTable[];
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

export type IRegistryFunctionPropTable =
  | {
      title: string;
      required: boolean;
      defaultValue: string | undefined;
      propDesc: string;
      type: "enum";
      enums: string[];
    }
  | {
      title: string;
      required: boolean;
      defaultValue: string | undefined;
      propDesc: string;
      type: string;
      typeDesc?: string;
    };
