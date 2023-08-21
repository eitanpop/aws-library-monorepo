# Introduction

Welcome to the clarity-monorepo-backend, the backend monorepo for our project! This repository uses [Lerna](https://lernajs.io/) to manage multiple packages within a single repository.

# Benefits of Using a Monorepo

- **Easier dependency management**: With a monorepo, you can easily manage dependencies between packages. You can also easily test changes made to a package in the context of the larger project.

- **Simplified development workflow**: All packages in the monorepo are versioned and published together, which means that you don't have to worry about version mismatches between packages.

- **Improved code sharing**: It's easier to share code between packages in a monorepo, as you don't have to worry about publishing and installing packages from a remote repository.

- **Single lint, build, and test configuration**: With a monorepo, you can have a single lint, build, and test configuration for all packages, which means you don't have to maintain separate configurations for each package.

# Setting Up the Monorepo

To get started with the monorepo, you'll need to have the following tools installed:

- [Node.js](https://nodejs.org/)

Once you have these tools installed, clone the repository and run the following command to install the dependencies:

```bash
npm i
```

# Managing the Packages

The monorepo is organized into a number of packages, each of which is located in the `packages` directory. To add a new package, simply create a new directory within the `packages` directory and add your code.

To manage the packages, we use Lerna. The following Lerna commands are available:

- `npm run build`: Build all packages.

- `npm run test`: Run the tests for all packages.

- `npm run publish`: Publish all packages to the npm registry.

# Deploying the Packages

To deploy the packages you can navigate to the specific package directory and run the following commands or run it from the root folder to deploy all packages:

- `npm run deploy:dev`: Uses IaC to deploy to dev environment with 'dev' stage

- `npm run deploy:stg`: Uses IaC to deploy to staging environment with 'stg' stage

- `npm run deploy:prod`: Uses IaC to deploy to production environment with 'prd' stage
