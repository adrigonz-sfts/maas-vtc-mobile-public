import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginImport from 'eslint-plugin-import-x';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,

    ...pluginVue.configs['flat/recommended'],

    pluginImport.flatConfigs.recommended,

    // ──────────────────────────────────────────────
    // Global settings
    // ──────────────────────────────────────────────
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },

        settings: {
            'import-x/resolver': {
                alias: {
                    map: [['@', './src']],
                    extensions: ['.js', '.ts', '.vue', '.json'],
                },
                node: {
                    extensions: ['.js', '.ts', '.vue', '.json'],
                },
            },
            'import-x/external-module-folders': ['node_modules'],
        },
    },

    // ──────────────────────────────────────────────
    // TypeScript files
    // ──────────────────────────────────────────────
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['src/__e2e__/**'],

        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.eslint.json',
            },
        },

        plugins: {
            '@typescript-eslint': tseslint,
        },

        rules: {
            ...tseslint.configs.recommended.rules,
            ...tseslint.configs['recommended-requiring-type-checking'].rules,

            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },

    // ──────────────────────────────────────────────
    // Test files - relax some type-checking rules
    // ──────────────────────────────────────────────
    {
        files: ['src/**/__tests__/**/*.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],

        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.eslint.json',
            },
        },

        plugins: {
            '@typescript-eslint': tseslint,
        },

        rules: {
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/unbound-method': 'off',
        },
    },

    // ──────────────────────────────────────────────
    // Vue files with TypeScript script
    // ──────────────────────────────────────────────
    {
        files: ['src/**/*.vue'],

        languageOptions: {
            parser: pluginVue.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                parser: tsparser,
                extraFileExtensions: ['.vue'],
            },
        },

        plugins: {
            '@typescript-eslint': tseslint,
        },

        rules: {
            ...tseslint.configs.recommended.rules,
        },
    },

    // ──────────────────────────────────────────────
    // Production code rules (src/**)
    // ──────────────────────────────────────────────
    {
        files: ['src/**/*.{js,ts,vue}'],

        rules: {
            // ── Indentation: 4 spaces everywhere ──
            indent: ['error', 4, { SwitchCase: 1 }],
            'vue/html-indent': ['error', 4],
            'vue/script-indent': ['error', 4, { baseIndent: 0, switchCase: 1 }],

            // ── No else ──
            'no-else-return': ['error', { allowElseIf: false }],

            // ── Braces required on all blocks ──
            curly: ['error', 'all'],

            // ── camelCase enforcement (allow destructuring from API DTOs) ──
            camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],

            // ── No magic numbers (allow -1, 0, 1, 2 and array indices) ──
            'no-magic-numbers': [
                'warn',
                {
                    ignore: [-1, 0, 1, 2],
                    ignoreArrayIndexes: true,
                    ignoreDefaultValues: true,
                    enforceConst: true,
                },
            ],

            // ── Imports: relative paths allowed, prefer @/ for cross-module imports ──
            'no-restricted-imports': 'off',

            // ── Import hygiene ──
            'import-x/no-unresolved': 'error',
            'import-x/named': 'error',
            'import-x/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'never',
                },
            ],
            'import-x/no-duplicates': 'error',

            // ── General code quality ──
            'no-console': 'warn',
            'no-debugger': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            eqeqeq: ['error', 'always'],
            'no-implicit-coercion': 'error',
            'no-nested-ternary': 'error',
            'no-unneeded-ternary': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'prefer-template': 'error',
            'object-shorthand': ['error', 'always'],
            'no-param-reassign': ['error', { props: false }],

            // ── Vue-specific ──
            'vue/component-api-style': ['error', ['script-setup']],
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'error',
            'vue/html-self-closing': [
                'error',
                {
                    html: { void: 'always', normal: 'never', component: 'always' },
                    svg: 'always',
                    math: 'always',
                },
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: 1,
                    multiline: 1,
                },
            ],
            'vue/first-attribute-linebreak': [
                'error',
                {
                    singleline: 'beside',
                    multiline: 'below',
                },
            ],
            'vue/attribute-hyphenation': ['error', 'never'],
            'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }],
            'vue/v-bind-style': ['error', 'shorthand'],
            'vue/v-on-style': ['error', 'shorthand'],
            'vue/no-unused-refs': 'error',
            'vue/no-useless-v-bind': 'error',
            'vue/prefer-true-attribute-shorthand': 'error',
        },
    },

    // ──────────────────────────────────────────────
    // Views: allow relative imports for view-specific modules
    // ──────────────────────────────────────────────
    {
        files: ['src/views/**/*.vue'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../*'],
                            message: 'Use @/ alias for parent directory imports.',
                        },
                    ],
                },
            ],
        },
    },

    // ──────────────────────────────────────────────
    // E2E test files
    // ──────────────────────────────────────────────
    {
        files: ['src/__e2e__/**/*.{ts,tsx}'],

        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.e2e.json',
            },
            globals: {
                ...globals.node,
            },
        },

        plugins: {
            '@typescript-eslint': tseslint,
        },

        rules: {
            ...tseslint.configs.recommended.rules,

            // Relax magic numbers in tests
            'no-magic-numbers': 'off',

            // Tests sometimes need console for debugging
            'no-console': 'off',
        },
    },

    // ──────────────────────────────────────────────
    // Test-specific overrides (test files + factories)
    // ──────────────────────────────────────────────
    {
        files: [
            'src/**/*.spec.{js,ts,vue}',
            'src/**/__tests__/**/*.{js,ts,vue}',
            'src/test/**/*.{js,ts,vue}',
            'src/helpers/**/*.{js,ts,vue}',
        ],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },

        rules: {
            // Relax magic numbers in tests (assertions, IDs, indices)
            'no-magic-numbers': 'off',

            // Allow relative imports inside test helpers/factories
            'no-restricted-imports': 'off',

            // Tests sometimes need console for debugging
            'no-console': 'off',

            // Allow param reassign for store manipulation in tests
            'no-param-reassign': 'off',
        },
    },

    // ──────────────────────────────────────────────
    // Vue <script> indent override
    //   (avoids conflict between `indent` and `vue/script-indent`)
    // ──────────────────────────────────────────────
    {
        files: ['src/**/*.vue'],
        rules: {
            indent: 'off',
            // Top-level variables in <script setup> are used by templates;
            // ESLint cannot see template usage, so this rule produces false positives.
            'no-useless-assignment': 'off',
        },
    },

    // ──────────────────────────────────────────────
    // Prettier integration (disables conflicting rules)
    // ──────────────────────────────────────────────
    prettierConfig,

    // ──────────────────────────────────────────────
    // Ignored paths
    // ──────────────────────────────────────────────
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            'public/**',
            'playwright-report/**',
            'test-results/**',
        ],
    },
];
