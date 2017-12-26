const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry:
        [
            path.resolve(__dirname, 'src/main.js'),
        ],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: "[id].chunk.js"
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
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },

            // 样式预编译
            {
                test: /\.(sass|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },

            // require img in js file, return DateURL
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 1024,
                            name: 'img/[name].[ext]'
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
            name: 'common',
            minChunks: 2
        }),
        // css单独打包成chunk
        new ExtractTextPlugin({
            filename: "[name].[contenthash].css",
            allChunks: true
        }),

        // minify output js codes
        // new UglifyJsPlugin({
        //     cache: true
        // }),

        // generate html5 file for you that includes all your webpack bundles in the body using script tags.
        new HtmlWebpackPlugin({
            template: './src/index.html'
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

        new webpack.NamedModulesPlugin(),

        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        publicPath: '/',
        port: 9001,
        hot: true,
        inline: true
    }
}