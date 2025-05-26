const { defineConfig } = require('eslint/config');
const baseConfig = require('expo-module-scripts/eslint.config.base');

module.exports = defineConfig([
  ...baseConfig,
  {
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }],
      'import/no-default-export': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { 
        props: 'never',
        children: 'never' 
      }],
      'react/self-closing-comp': 'error',
      'react-hooks/exhaustive-deps': 'error'
    }
  },
  {
    files: ['**/*.config.js', '**/*.config.ts', '**/metro.config.js', '**/babel.config.js', '**/ExpoMilibrisModule.ts', '**/index.ts'],
    rules: {
      'import/no-default-export': 'off'
    }
  },
  {
    files: ['example/**/*'],
    rules: {
      'no-console': 'off'
    }
  }
]); 