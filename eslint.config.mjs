import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'airbnb',
    'airbnb/hooks'
  ),
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      'jsx-a11y': jsxA11y,
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      'comma-dangle': ['error', 'only-multiline'],
      'import/imports-first': ['error', 'absolute-first'],
      'import/newline-after-import': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'import/no-named-as-default': 0,
      'import/no-unresolved': [2, { ignore: ['react'] }],
      'import/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'external',
              pattern: 'react',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
      'import/prefer-default-export': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/control-has-associated-label': 'warn',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          required: {
            some: ['nesting', 'id'],
          },
        },
      ],
      'jsx-a11y/label-has-for': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'no-underscore-dangle': [
        'error',
        {
          allow: ['__filename', '__dirname'],
        },
      ],
      'no-unused-vars': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.js', '.jsx'] },
      ],
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
  },
];

export default eslintConfig;
