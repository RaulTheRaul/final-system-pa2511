// FINAL-SYSTEM-PA2511/functions/.eslintrc.js

module.exports = {
  env: {
    es6: true, // Enable ES6 globals (like Promise)
    node: true, // Enable Node.js global variables and Node.js scoping.
    commonjs: true, // Enable CommonJS global variables and CommonJS scoping (use global 'require').
  },
  extends: [
    "eslint:recommended",
    "google", // Uses the Google Style Guide (common for Firebase examples)
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows parsing of modern ECMAScript features
  },
  rules: {
    "quotes": ["error", "double"], // Enforce double quotes
    "indent": ["error", 2], // Enforce 2-space indentation
    "object-curly-spacing": ["error", "always"], // Enforce spacing inside curly braces { like: this }
    "require-jsdoc": "off", // Turn off requirement for JSDoc comments (often excessive for functions)
    "valid-jsdoc": "off", // Turn off validation of JSDoc comments
    "max-len": ["warn", { "code": 120 }], // Warn if lines are too long, rather than error
    "camelcase": ["warn", { "properties": "never" }], // Warn about camelCase, but allow snake_case in properties (like from APIs)
  },
  ignorePatterns: ["node_modules/"], // Ignore node_modules folder
};