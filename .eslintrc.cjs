/* ESLint configuration for the Vite + React + TypeScript frontend. */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react-refresh'],
  ignorePatterns: [
    'dist',
    'node_modules',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    '*.cjs',
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    // App code intentionally uses a few `any`s at untyped boundaries (axios errors, etc.).
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
