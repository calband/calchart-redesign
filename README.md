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
```bash
# Run all tests
npm run test:unit
# Run specific tests named Grapher
npm run test:unit Grapher
# Watch all tests
npm run test:unit -- --watchAll
```

See [Jest CLI docs](https://jestjs.io/docs/en/cli.html#running-from-the-command-line) for all jest options, just replace `jest` with `npm run test:unit`, and before writing the flags, insert `--`.

### Debug your unit tests
```bash
# On Mac/Linux
node --inspect-brk node_modules/.bin/jest --runInBand
# On Windows
node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand
```
See [Jest docs](https://jestjs.io/docs/en/troubleshooting#tests-are-failing-and-you-dont-know-why) for more information on how to debug.

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```
