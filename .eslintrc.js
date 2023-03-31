module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],

  overrides: [],
  parser: '@typescript-eslint/parser', // make eslint to understand or parse our typescript code.
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // project: 'tsconfig.eslint.json',
    project: './tsconfig.json',
    // tsconfigRootDir: './',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'no-console': 1,
    'prettier/prettier': 2, // Means error
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
  ignorePatterns: ['dist/', 'build/'],
};
