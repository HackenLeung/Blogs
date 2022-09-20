// webpack.config.js
const baseConfig = require("./webpack.common.js");
const { merge } = require("webpack-merge");
module.exports = merge(baseConfig,{
    mode: 'production', // 环境模式

})
