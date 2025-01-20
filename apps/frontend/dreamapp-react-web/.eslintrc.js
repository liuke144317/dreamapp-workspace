module.exports = {
    root: true, // 确保这是根配置，防止子项目覆盖
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:prettier/recommended", // 开启 Prettier 插件，并关闭与 Prettier 冲突的 ESLint 规则
    ],
    plugins: ["prettier"], // 加载 Prettier 插件
    rules: {
        "prettier/prettier": "error", // 将 Prettier 的问题作为错误报告
    },
};
