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
    "no-console": process.env.ENV === "pro" ? "warn" : "off",
    "no-debugger": process.env.ENV === "pro" ? "warn" : "off"
  }
};
