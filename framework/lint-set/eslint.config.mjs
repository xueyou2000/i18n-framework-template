import js from '@eslint/js'
import { defineFlatConfig } from 'eslint-define-config'
import globals from 'globals'
import ts from 'typescript-eslint'

import { fixupConfigRules } from '@eslint/compat'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js'
import react from 'eslint-plugin-react/configs/recommended.js'

export default defineFlatConfig([
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...fixupConfigRules([
    {
      ...react,
      settings: {
        react: { version: 'detect' }
      }
    },
    reactJsx
  ]),
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      quotes: ['error', 'single'], // 使用单引号
      semi: ['error', 'never'], // 不在语句末尾使用分号
      '@typescript-eslint/explicit-function-return-type': 'off', // 关闭显式函数返回类型检查
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭显式模块边界类型检查
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          jsxSingleQuote: true
        }
      ],
      'jsx-quotes': ['error', 'prefer-single']
    }
  },
  { ignores: ['dist/', '**/dist/', 'node_modules', '**/node_modules/'] }
])
