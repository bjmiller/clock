const js = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

const config = defineConfig(
  {
    ignores: ['dist/*']
  },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      'prettier/prettier': 'error',
      curly: ['error', 'all'],
      'default-case': ['error'],
      'dot-notation': ['error'],
      eqeqeq: [
        'error',
        'always',
        {
          null: 'ignore'
        }
      ],
      'global-require': ['error'],
      'guard-for-in': ['warn'],
      'max-len': [
        'error',
        {
          // eslint-disable-next-line no-magic-numbers
          code: 120,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreTemplateLiterals: true
        }
      ],
      'new-parens': ['error'],
      'no-await-in-loop': ['error'],
      'no-buffer-constructor': ['error'],
      'no-confusing-arrow': [
        'error',
        {
          allowParens: true
        }
      ],
      'no-console': ['warn'],
      'no-duplicate-imports': ['error'],
      'no-eval': ['error'],
      'no-extra-bind': ['warn'],
      'no-extra-parens': [
        'warn',
        'all',
        {
          ignoreJSX: 'all'
        }
      ],
      'no-floating-decimal': ['warn'],
      'no-implicit-coercion': ['error'],
      'no-implicit-globals': ['error'],
      'no-implied-eval': ['error'],
      'no-lonely-if': ['error'],
      'no-loop-func': ['error'],
      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          detectObjects: true
        }
      ],
      'no-misleading-character-class': ['error'],
      'no-new': ['error'],
      'no-new-object': ['error'],
      'no-new-require': ['error'],
      'no-new-wrappers': ['error'],
      'no-param-reassign': [
        'error',
        {
          props: false
        }
      ],
      'no-return-assign': ['error'],
      'no-shadow': [
        'error',
        {
          builtinGlobals: true,
          allow: ['name', 'length', 'Request', 'Response']
        }
      ],
      'no-shadow-restricted-names': ['error'],
      'no-template-curly-in-string': ['warn'],
      'no-throw-literal': ['error'],
      'no-unmodified-loop-condition': ['error'],
      'no-useless-computed-key': ['warn'],
      'no-var': ['warn'],
      'prefer-const': ['error'],
      'prefer-template': ['warn'],
      radix: ['error'],
      'require-await': ['error'],
      yoda: [
        'error',
        'never',
        {
          exceptRange: true
        }
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'none'
        }
      ],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports'
        }
      ],
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['eslint.config.cjs', 'eslint.config.js'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  prettier
);

module.exports = config;
