module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    plugins: ["react", "prettier", "@typescript-eslint", "react-hooks"],
    extends: [
        "plugin:react/recommended",
        // "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },

    rules: {
        "react-hooks/rules-of-hooks": "error",
        // "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/interface-name-prefix": [
            "error",
            {
                prefixWithI: "always"
            }
        ],
        "@typescript-eslint/camelcase": ["off"]
    },
    settings: {
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    }
};
