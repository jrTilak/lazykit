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

5. Create a file called `props.ts` as the description of props. It should export a default object as given in the files in the any of the existing methods. [here](../src/www/src/registry/)

6. Create a file `docs.md` as the description of the method.

```md
---
desc: Short description of the method
externalLinks:
  - label: Title of the link
    url: URL of the link
  - title: Title of the link
    label: URL of the link etc
---

You can write a detailed description of the method here.
```

_You can see any of the existing methods for reference._ [here](../src/www/src/registry/)

6. Run `pnpm test` to make sure the tests pass.
7. Run `pnpm build:registry` to build the registry.

8. Commit your changes and create a pull request to the `dev` branch.
