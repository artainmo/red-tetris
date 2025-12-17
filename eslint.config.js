import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import react from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{
		files: ['src/client/**/*.js'],
		plugins: {
			react,
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
			},
		},
		rules: {
			...js.configs.recommended.rules,
			...react.configs.recommended.rules,
			// 'no-console': 'warn',
			'no-unused-vars': 'error',
			'no-debugger': 'error',
			'no-alert': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			eqeqeq: 'error',
			curly: 'error',
			'brace-style': 'error',
			semi: ['error', 'never'],
			'no-trailing-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
			'react/prop-types': 'warn',
			'react/jsx-key': 'error',
			'react/jsx-no-duplicate-props': 'error',
			'react/jsx-no-undef': 'error',
			'react/no-unused-prop-types': 'warn',
			'react/prefer-stateless-function': 'warn',
		},
	},
	{
		files: ['src/server/**/*.js'],
		languageOptions: {
			sourceType: 'script',
			ecmaVersion: 'latest',
			globals: {
				...globals.node,
				__dirname: 'readonly',
				require: 'readonly',
				module: 'readonly',
			},
		},
		rules: {
			...js.configs.recommended.rules,
			// 'no-console': 'warn',
			'no-unused-vars': 'error',
			'no-debugger': 'error',
			'no-alert': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			eqeqeq: 'error',
			curly: 'error',
			'brace-style': 'error',
			semi: ['error', 'never'],
			'no-trailing-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
		},
		ignores: ['src/server/test.js'],
	},
])
