import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const config = tseslint.config(
    /**
     * ignore
     */
    {
        name: 'Global Ignores',
        ignores: ['build', 'dist', 'out', 'resources', 'assets']
    },
    /**
     * base
     */
    eslint.configs.recommended,
    /**
     * typescript
     */
    ...tseslint.configs.recommended,

    /**
     * react
     */
    {
        files: ['src/renderer/src/**/*.{ts,tsx}'],
        languageOptions: {
            globals: globals.browser,
            parser: tseslint.parser
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        plugins: {
            'react-hooks': reactHooks,
            react: react
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules
        }
    },
    /**
     * shared rules (Main + Renderer)
     */
    {
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn'
        }
    },
    /**
     * turns off all rules that are unnecessary or might conflict with Prettier
     */
    prettier
)

export default config
