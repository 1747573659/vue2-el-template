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
    "no-console": process.env.NODE_ENV === "production" && process.env.VUE_APP_FLAG === "pro" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production"  && process.env.VUE_APP_FLAG === "pro" ? "warn" : "off"
  }
};
