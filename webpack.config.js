const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        vendor: ['react'],
        // vendor: [],
        main: path.resolve(__dirname, 'src/main.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: "[id].[chunkhash:8].js"
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
        // 公用模块打包成chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunk: 2,
            chunks: ['main']
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

        // generate html5 file for you that includes all your webpack bundles in the body using script tags.
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: true,
            minify: {
                removeComments: true,      // 移除html中的注释
                collapseWhitespace: false  // 删除空白符与换行符
            }
        }),

        // clean dist before build
        new CleanWebpackPlugin(
            ['dist']
        ),

        // global var
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        // 使用模块的相对路径作为模块的id
        new webpack.NamedModulesPlugin(),

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