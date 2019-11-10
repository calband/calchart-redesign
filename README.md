# Calchart

Calchart 4.0 for the web!

See this [Figma link](https://www.figma.com/file/XIkyioLzRlGlpmNiEu47glkQ/Calchart) for the design.

Project created from [Vue CLI](https://cli.vuejs.org/).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```sh
# Run all tests
npm run test:unit
# Run specific tests that match regex "Grapher"
npm run test:unit Grapher
# Watch all tests
npm run test:unit -- --watchAll
```

See [this](https://cli.vuejs.org/core-plugins/unit-jest.html#injected-commands) for more information. To run with flags for jest, insert `--` before the flags.

### Debug your unit tests
```sh
# macOS or linux
node --inspect-brk ./node_modules/.bin/vue-cli-service test:unit
# Windows
node --inspect-brk ./node_modules/@vue/cli-service/bin/vue-cli-service.js test:unit
```
See [this](https://cli.vuejs.org/core-plugins/unit-jest.html#debugging-tests) for more information on how to debug.

### Run your end-to-end tests
```sh
# Run normally (opens Chrome)
npm run test:e2e
# Run in headless mode (generates videos)
npm run test:e2e -- --headless
```

See [this](https://cli.vuejs.org/core-plugins/e2e-cypress.html) for more information.

### Lints and fixes files
```
npm run lint
```

See [this](https://cli.vuejs.org/core-plugins/eslint.html#injected-commands) for more information.
