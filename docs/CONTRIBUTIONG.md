# Contributing

Thanks for your interest in contributing to Lazykit. We're happy to have you here.

We use `pnpm` as the package manager. You can install it by running:

```bash
npm install -g pnpm
```

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to reach out to [@jrTilak](https://twitter.com/iamjrtilak)

1. Fork the repository.
2. Clone the forked repository.
3. Run `pnpm install` to install the dependencies.
4. These are some scripts you can run:
   - `pnpm test` - Run the tests.
   - `pnpm build:registry` - Build the registry.
   - `pnpm build:cli` - Build the CLI.
   - `pnpm build:www` - Build the WWW.
   - `pnpm watch:cli` - Build the CLI and watch for changes.
   - `pnpm dev:www` - Start a development server for the WWW.
   - See the `package.json` for more scripts.
5. Make your changes.
6. Run `pnpm test` to make sure the tests pass.
7. Commit your changes using the following convention:
   - `feat: Added a new feature`
   - `fix: Fixed a bug`
   - `docs: Updated the docs`
   - `refactor: Refactored the code`
   - `test: Added a new test`
   - `chore: Updated the build process`
   - etc
8. Push your changes to your fork.
9. Create a pull request to the `dev` branch.
10. Wait for the review and merge.

## See Also

- [Adding a new method](ADDING_A_NEW_METHOD.md)
- [Adding a new category](ADDING_A_NEW_CATEGORY.md)
- [Adding a new type](ADDING_A_NEW_TYPE.md)
