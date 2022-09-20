// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
// const ESLintPlugin = require("eslint-webpack-plugin");
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver, ElementUiResolver } = require('unplugin-vue-components/resolvers')
const AutoImport = require('unplugin-auto-import/webpack')
const { DefinePlugin } = require("webpack")

module.exports = {
    entry: path.resolve(__dirname, '../src/main.ts'), // 打包入口
    output: {
        path: path.resolve(__dirname, '../dist'), // 打包出口
        filename: 'js/[name].js' // 打包完的静态资源文件名
        // clean: true, // 清理打包目录
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],  // 省略拓展名
        alias: {
            "@": path.resolve(__dirname, "../src"),  // 设置别名
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ['style-loader', 'css-loader', "postcss-loader", "sass-loader"] // loader 的应用顺序是从右往左，从下往上的
            },
            // {
            //     test: /\.ts$/,
            //     exclude: /node_modules/,
            //     loader: "ts-loader",
            //     options: {
            //         appendTsSuffixTo: [/\.vue$/],
            //     },
            // },
            {
                test: /\.(t|j)s$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            // 在 webpack5 之前，加载图片、字体等资源需要我们使用 url-loader、 file-loader 等来处理
            //  webpack5开始内置 Asset Modules type代替 四种类型
            // asset/resource 发送一个单独的文件并导出 URL，之前通过使用 file-loader 实现
            // asset/inline 导出一个资源的 data URI，之前通过使用 url-loader 实现
            // asset/source 导出资源的源代码，之前通过使用 raw-loader 实现
            // asset 在导出一个 data URI 和发送一个单独的文件之间自动选择，之前通过使用 url-loader 实现，并且可以配置资源体积限制
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                type: "asset",
                generator: {
                    filename: "images/[name]-[hash][ext]", // [ext] 扩展名通配符包含了 .
                }
            },
            {
                test: /\.(eot|svg|ttf|woff2?|)$/,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name]-[hash][ext]",
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'), // 我们要使用的 html 模板地址
            filename: 'index.html', // 打包后输出的文件名
            title: '我的博客', // index.html 模板内，通过 <%= htmlWebpackPlugin.options.title %> 拿到的变量
        }),
        // 添加 VueLoaderPlugin 插件
        new VueLoaderPlugin(),
        // 注意如果不声明文件扩展名，eslint默认只会检查js结尾的文件
        // new ESLintPlugin({ extensions: ["js", "ts", "vue"] }),
        // 自动按需引入ui库
        Components({
            resolvers: [
                ElementPlusResolver(),
                ElementUiResolver()
            ]
        }),
        // 自动引入模块
        AutoImport({
            // targets to transform
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/, /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],
            imports: [
                // presets
                'vue',
                'vue-router',
                // custom
            ],
            dirs: ['src/store'],
            dts: 'src/auto-imports.d.ts'
        }),
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true,
        })
    ],
}
