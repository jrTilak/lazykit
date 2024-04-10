# CLI

This is located at [src/cli/](../src/cli/). It is source code for all the CLI.

## Folder Structure

```
├──src/
    ├──assets/
    ├──data/
    ├──scripts/
    ├──types/
    ├──utils/
    └──index.ts
```

- `assets`: The assets for the CLI like images, etc.
- `data`: The data like constants, etc.
- `scripts`: The scripts command for the CLI like `init`, `add`, etc.
- `types`: The types for the CLI.
- `utils`: The utility functions for the CLI.
- `index.ts`: The entry point for the CLI.

## How cli works (add)

The `add` command is used to add a new method to the registry. It first request to api to the data of the method and then it creates a file in the specified folder with the data.
