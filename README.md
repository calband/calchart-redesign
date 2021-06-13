# Calchart

Calchart 4.0 for the web!

See this [Figma link](https://www.figma.com/file/XIkyioLzRlGlpmNiEu47glkQ/Calchart) for the design. Also see [calchart-redesign-old](https://github.com/calband/calchart-redesign-old) for the prototype.

Project bootstrapped from [Vue CLI](https://cli.vuejs.org/).

## On-boarding

See [this onboarding page](https://www.notion.so/CalChart-Developer-Onboarding-e691b40cdcdf498ea0afa4d491e8a290) for getting started on development.

## Project setup

```
npm ci
```

Please use `npm ci` instead of `npm install` to avoid `package-lock.json` being changed at random. For example see https://github.com/npm/cli/issues/1360.

Please use the LTS version of [NodeJS/npm](https://nodejs.org/en/) for this project.

We recommend using [Visual Studio Code](https://code.visualstudio.com/) as your IDE. This integrates well with Typescript. We recommend installing the following extensions: ESLint, Vetur, Debugger for Chrome, Debugger for Firefox.

To set up debugging in vscode, please see [Vue CLI docs](https://vuejs.org/v2/cookbook/debugging-in-vscode.html).

## Compiles and hot-reloads for development

```
npm run serve
```

## Compiles and minifies for production

```
npm run build
```

## Run your unit tests

```sh
# Run all tests
npm run test:unit
# Run specific tests that match regex "Grapher"
npm run test:unit Grapher
# Watch all tests
npm run test:unit -- --watchAll
```

We are using [Jest](https://jestjs.io/) for the unit test framework.

[Vue CLI docs](https://cli.vuejs.org/core-plugins/unit-jest.html#injected-commands).

## Debug your unit tests

```sh
# macOS or linux
node --inspect-brk ./node_modules/.bin/vue-cli-service test:unit
# Windows
node --inspect-brk ./node_modules/@vue/cli-service/bin/vue-cli-service.js test:unit
```

See [this](https://jestjs.io/docs/en/troubleshooting.html#tests-are-failing-and-you-dont-know-why) for instructions on how to attach Google Chrome or VSCode to the tests.

[Vue CLI docs](https://cli.vuejs.org/core-plugins/unit-jest.html#debugging-tests)

## Run your end-to-end tests

```sh
# Run normally (opens Chrome)
npm run test:e2e
# Run in headless mode (generates videos)
npm run test:e2e -- --headless
```

We are using [Cypress](https://www.cypress.io/) for the end to end test framework.

[Vue CLI docs](https://cli.vuejs.org/core-plugins/e2e-cypress.html)

## Lints and fixes files

```
npm run lint
```

[Vue CLI docs](https://cli.vuejs.org/core-plugins/eslint.html#injected-commands)

Integrate ESLint with your text editor! See [this](https://eslint.vuejs.org/user-guide/#editor-integrations).

## Update dependencies

To update the dependencies in `package.json` and `package-lock.json`, first try updating the Vue CLI plugins, then any other package.

### Update Vue CLI Plugins

```
npm install -g @vue/cli # Install globally if not already
vue upgrade
```

### Identify and update other packages

```
npm outdated # Lists available package versions
npm update # Updates packages within the specified range in package.json
```

To update a package at a specified version:

```
npm install package@version
```
