import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores([
        '**/build/**',
        '**/dist/**',
        '**/out/**',
        '**/resources/**',
        '**/assets/**',
        '**/eslint.config.mjs',
        '**/tailwind.config.js',
        '**/jest.config.js',
        '**/postcss.config.js'
    ]),

    // Base configurations
    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    // Global language options (shared)
    {
        languageOptions: {
            globals: {
                ...globals.node
            },
            // Use projectService instead of project
            parserOptions: {
                projectService: true
            }
        }
    },

    // Main process files
    {
        files: ['src/main/**/*.{ts,js}'],
        languageOptions: {
            globals: {
                ...globals.node
            },
            parser: tseslint.parser
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error'
        }
    },

    // Preload process files (if you have them)
    {
        files: ['src/preload/**/*.{ts,js}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser
            },
            parser: tseslint.parser
        }
    },

    // Renderer process files
    {
        files: ['src/renderer/**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser
            },
            parser: tseslint.parser
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            // React recommended rules
            ...reactPlugin.configs.flat.recommended.rules,
            // JSX runtime rules
            ...reactPlugin.configs.flat['jsx-runtime'].rules,
            // React hooks rules
            ...reactHooksPlugin.configs.recommended.rules
        }
    },

    // Shared TypeScript rules
    {
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/explicit-member-accessibility': 'warn'
        }
    },

    // Prettier compatibility (always last)
    eslintConfigPrettier
])
