import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintReactRefresh from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImportX from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      '__mocks__/**',
      'coverage',
      'eslint.config.js',
      'webpack.config.js',
      'jest.config.ts',
      'jest.setup.ts',
    ],
  },

  js.configs.recommended,

  // import-x наборы правил
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,

  ...tseslint.configs.recommended,

  // общие настройки окружения и плагинов
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: eslintReact,
      'react-hooks': eslintReactHooks,
      'react-refresh': eslintReactRefresh,
      prettier: prettierPlugin,
      'import-x': eslintPluginImportX,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    settings: {
      react: { version: 'detect' },

      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['./tsconfig.eslint.json'],
          alwaysTryTypes: true,
        }),
      ],
    },

    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "VariableDeclaration[kind='let']",
          message: 'Используйте const вместо let.',
        },
      ],
    },
  },

  // декларации — не трогаем import-x правилами
  {
    files: ['**/*.d.ts'],
    rules: {
      'import-x/no-unresolved': 'off',
      'import-x/order': 'off',
      'import-x/namespace': 'off',
      'import-x/default': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },

  // правила для TS/TSX
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,

      'import-x/no-dynamic-require': 'warn',
      'import-x/no-nodejs-modules': 'warn',

      // не пытаемся резолвить стили/ассеты как node-модули
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['\\.s?css$', '\\.svg(\\?url)?$', '\\.(png|jpe?g|gif|webp|avif|ico)$'],
        },
      ],

      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'src/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'prefer-const': 'error',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'max-lines': ['warn', { max: 125 }],
      'max-params': ['error', 3],
    },
  },
];
