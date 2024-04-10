# Registry

This is located at [src/www/src/registry/](../src/www/src/registry/). It is source code for all the registry methods.

## Folder Structure

```
└──[type]
    └──[category]
        └──[method]
            ├── index.ts
            ├── index.test.ts
            ├── docs.tsx
            └── *.example.ts
```

- `type`: The type of the method. `kebab-case` is used while writing the folder name. Eg.

  - `functions`: JavaScript utility functions.
  - `react-hooks`: React hooks. _(Expected to be added in future)_
  - `etc`

- `category`: The category of the method. Eg. `array`, `object`, `string`, etc. `kebab-case` is used while writing the folder name.

- `method`: The method name. Eg. `chunk`, `mapObj`, `search`, `capitalize`, etc. `camelCase` is used while writing the folder name.

## Files

- `index.ts`: The source code of the method.
- `index.test.ts`: The test file for the method.
- `*.example.ts`: The example file for the method. At least one example file is required.
- `docs.tsx`: The documentation for the method.
  It needs to export the following:
  - `default`: The description for the method as a React component.
  - `Info`: The additional information for the method as object which contains:
    - `description`: The description for the method.
    - `externalLinks`: The array of external links for the method. (Optional)
  - `Props`: The props for the method as a React component.

_You can see any of the existing methods for reference._ [here](../src/www/src/registry/)

