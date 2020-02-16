module.exports = {
  root: true, // Do not use parent eslintrc
  extends: [
    'eslint:recommended',
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
