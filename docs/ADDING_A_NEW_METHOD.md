# Adding a new method

Methods are the third level of the registry. They are the functions that are used to perform a specific task.

1. Create a folder in `registry/<type>/<category>/` with the name of the method.
2. Create a file `index.ts` as the source code for the method.
3. Create a file `index.test.ts` as the test file for the method. We use `vitest` for testing.
4. Create at least one example as `*.example.ts` showing how to use the method showing the result in console. and a comment as expected output.

```ts
console.log(result);
// Expected output: ...
```

5. Create a file `docs.tsx` as the description of the method.
   It needs to export the following:

- `default`: The description for the method as a React component.
- `Info`: The additional information for the method as object which contains:
  - `description`: The description for the method.
  - `externalLinks`: The array of external links for the method. (Optional)
- `Props`: The props for the method as a React component.

_You can see any of the existing methods for reference._ [here](../src/www/src/registry/)

6. Run `pnpm test` to make sure the tests pass.
7. Run `pnpm build:registry` to build the registry.

8. Commit your changes and create a pull request to the `dev` branch.
