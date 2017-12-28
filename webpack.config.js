const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        vendor: ['react'],
        main: path.resolve(__dirname, 'src/main.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js',
        // chunkFilename: "[id].[chunkhash:8].js"
    },

    module: {
        rules: [
            // js es6 => es5
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
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

            // require img in js file, return DateURL
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 1024,
                            name: 'img/[name].[hash:8].[ext]'
                        }
                    }
                ]
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
            chunk: ['manifest', 'vendor', 'main'],
        }),

        // 将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用客户端的长效缓存机制，可以通过命中缓存来消除请求，并减少向服务器获取资源，同时还能保证客户端代码和服务器端代码版本一致。这可以通过使用新的 entry(入口) 起点，以及再额外配置一个 CommonsChunkPlugin 实例的组合方式来实现：
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module){
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),

        // 在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。通过指定 entry 配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中, 防止引起无关chunk的更新
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            filename: '[name].[hash].js',
            minChunks: Infinity
        }),

        // 对模块路径进行md5摘要，不仅可以实现持久化缓存，同时还避免了它引起的两个大问题（文件增大，路径泄露（由于使用NamedModulesPlugin用路径标记模块导致）），用NamedModulesPlugin可以轻松实现chunkhash的稳定化
        new webpack.HashedModuleIdsPlugin(),

        // css单独打包成chunk
        new ExtractTextPlugin({
            filename: "styles/[name].[contenthash].css",
            allChunks: true
        }),

        // minify output js codes
        // new UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),

        // global var
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        // hot module replace
        new webpack.HotModuleReplacementPlugin(),

        // 公共导入
        new webpack.ProvidePlugin({
            'React': 'react',
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery",
            CSSModules: "react-css-modules"
        })
    ],

    // 若使用ExtractTextPlugin，DevServer中的hot=true参数要去掉，否则css文件无法热更新
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        publicPath: '/',
        port: 9001,
        inline: true
    }
}