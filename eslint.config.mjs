import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        ignores: ["dist/**", "node_modules/**", ".yarn/**"],
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...tseslint.configs["recommended-type-checked"].rules,
            "@typescript-eslint/no-unused-vars": [
                "error",
                {argsIgnorePattern: "^_", varsIgnorePattern: "^_"},
            ],
        },
    },
];
