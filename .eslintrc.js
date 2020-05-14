module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "semi": [2,"never"],
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'no-unused-vars': ['error', {args: 'after-used'}],
    'dot-notation': 'off'
  }
};
