// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following
// import and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('@cypress/webpack-preprocessor');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vueCliOptions = require('@vue/cli-service/webpack.config');

/**
 * We must use a different webpack congiuration for cypress. This is because
 * we need to use a different tsconfig.json file to compile the .ts files.
 *
 * Here we aim to use the following webpack rules from vue cli:
 * - resolve (just alias, extensions, and modules)
 * - resolveLoader
 * - The rule for .ts files
 *
 * https://github.com/cypress-io/cypress-webpack-preprocessor
 * Use `vue inspect` to see the webpack configuration for the app
 * Use `vue inspect --rule ts` to see the .ts file rule
 */
const options = webpack.defaultOptions;
options.webpackOptions.resolve = {
  alias: vueCliOptions.resolve.alias,
  extensions: vueCliOptions.resolve.extensions,
  modules: vueCliOptions.resolve.modules,
};
options.webpackOptions.resolveLoader = vueCliOptions.resolveLoader;
const tsRule = vueCliOptions.module.rules.find((rule) => {
  return rule.test.test('.ts');
});
const tsLoader = tsRule.use.find((loaderObj) => {
  return loaderObj.loader.includes('ts-loader');
});
tsLoader.options.configFile = 'tests/e2e/tsconfig.json';
options.webpackOptions.module.rules = [tsRule];

module.exports = (on, config) => {
  on('file:preprocessor', webpack(options));

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.ts',
  });
};
