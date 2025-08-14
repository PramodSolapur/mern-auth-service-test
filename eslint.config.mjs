// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    eslintConfigPrettier,
    {
        ignores: [
            'dist',
            'node_modules',
            'eslint.config.mjs',
            'jest.config.js',
            './scripts/*',
            './coverage/*',
            './tests/*',
            '*.spec.ts', // <--- add this line
            '**/*.spec.ts', // <--- and this line for nested spec files
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: process.cwd(),
            },
        },
        rules: {
            // 'no-console': 'error',
            // 'dot-notation': 'error',
            '@typescript-eslint/no-unused-vars': [
                'off',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
)
