const path = require('path');
const os = require('os')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length}); // 启动线程池});
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        vendor: ['react'],
        main: path.resolve(__dirname, '../src/main.js'),
    },

    module: {
        rules: [
            // js es6 => es5
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // use: 'babel-loader'
                use: 'happypack/loader?id=js'
            },

            // css-loader 解析css, style-loader 将样式插入到style标签 modules：css-modules 模块化css文件，防止污染全局
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?modules"
                })
            },

            // 样式预编译
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader?modules", "sass-loader"]
                })
            },

            // font load
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }

            // csv / tsv data load csv-loader
            // xml load xml-loader
        ]
    },

    plugins: [
        // clean dist before build
        new CleanWebpackPlugin(
            ['dist']
        ),

        // generate html5 file for you that includes all your webpack bundles in the body using script tags.
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),

        // 将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用客户端的长效缓存机制，可以通过命中缓存来消除请求，并减少向服务器获取资源，同时还能保证客户端代码和服务器端代码版本一致。这可以通过使用新的 entry(入口) 起点，以及再额外配置一个 CommonsChunkPlugin 实例的组合方式来实现：
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module){
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),

        // 对模块路径进行md5摘要，不仅可以实现持久化缓存，同时还避免了它引起的两个大问题（文件增大，路径泄露（由于使用NamedModulesPlugin用路径标记模块导致）），用NamedModulesPlugin可以轻松实现chunkhash的稳定化
        new webpack.HashedModuleIdsPlugin(),

        // public import
        new webpack.ProvidePlugin({
            'React': 'react',
            CSSModules: "react-css-modules"
        }),

        // happypack的处理思路是将原有的webpack对loader的执行过程从单一进程的形式扩展多进程模式，原本的流程保持不变，这样可以在不修改原有配置的基础上来完成对编译过程的优化
        new HappyPack({
            id: 'js',
            threadPool: HappyThreadPool,
            loaders: ['babel-loader']
        })
    ],
}