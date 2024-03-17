export interface IRegistryJSON {
  name: string;
  code: {
    typescript: string;
    javascript: string;
    commonjs: string;
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
}

export interface IDoc {
  name: string;
  description: string;
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
