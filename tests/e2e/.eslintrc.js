module.exports = {
  extends: [
    'plugin:cypress/recommended',
  ],
  env: {
    node: true,
    mocha: true,
  },
  rules: {
    strict: 'off',
    'cypress/require-data-selectors': 'error',
  },
};
