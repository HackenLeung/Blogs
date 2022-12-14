module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
      ecmaVersion: 12,
      parser: "@typescript-eslint/parser",
      sourceType: "module",
    },
    plugins: ["vue", "@typescript-eslint"],
    // extends的优先级也是从后往前的
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:vue/vue3-recommended",
      "eslint:recommended",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-types": "off",
      "vue/multi-word-component-names":"off", // 关闭验证组件命名
    },
  };