module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    '@vue/typescript',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/array-type': 'warn',
    'brace-style': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'dot-location': ['warn', 'property'],
    'eqeqeq': 'error',
    'vue/eqeqeq': 'error',
    'eol-last': 'warn',
    '@typescript-eslint/explicit-member-accessibility': ['warn', {
      'accessibility': 'no-public',
    }],
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': ['warn'],
    'function-paren-newline': 'warn',
    'max-len': 'warn',
    '@typescript-eslint/member-naming': 'warn',
    'multiline-ternary': ['warn', 'always-multiline'],
    'newline-per-chained-call': 'warn',
    'no-else-return': 'warn',
    'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-parens': ['warn'],
    'no-extra-semi': 'warn',
    'no-multiple-empty-lines': 'warn',
    'no-multi-spaces': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-useless-concat': 'warn',
    '@typescript-eslint/no-useless-constructor': 'warn',
    'no-useless-return': 'warn',
    'no-trailing-spaces': 'warn',
    'no-var': 'warn',
    'object-curly-newline': 'warn',
    'object-curly-spacing': ['warn', 'always'],
    'object-property-newline': ['warn', {
      'allowAllPropertiesOnSameLine': true,
    }],
    'operator-linebreak': ['warn', 'before'],
    'prefer-const': 'warn',
    'quotes': ['warn', 'single'],
    'semi': 'off',
    '@typescript-eslint/semi': ['warn'],
  },
  overrides: [
    {
      // Disable typescript rules for js files. This was occuring in
      // tests/e2e/plugins/index.js.
      files: [
        '**/*.js',
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      // Overrides for jest unit tests
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      // Ignore vue cli generated shims
      files: [
        'src/main.ts',
        'src/shims-tsx.d.ts',
        'src/shims-vue.d.ts',
      ],
      rules: {
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
