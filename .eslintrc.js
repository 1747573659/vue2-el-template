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
    "no-debugger": process.env.NODE_ENV === "production"  && process.env.VUE_APP_FLAG === "pro" ? "warn" : "off",
    "no-unused-vars": "off", // 关闭未使用变量验证
    "no-empty": 'off' // 关闭块语句中的内容不能为空
  }
};
