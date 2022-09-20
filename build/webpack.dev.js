const baseConfig = require("./webpack.common.js");
const { merge } = require("webpack-merge");
module.exports = merge(baseConfig, {
    // publicPath: "./",
    mode: 'development', // 环境模式
    target: "web",
    devServer: {
        hot: true, // 启用热模块替换
        open: true, // 打开默认浏览器
        port: 8000,
    },
})
