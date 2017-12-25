const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:
        [
            path.resolve(__dirname, 'assets/main.js'),
        ],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js',
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
                use: ['style-loader?modules', 'css-loader?modules']
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
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            }
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
            filename: "[name].bundle.css",
            allChunks: true
        }),

        // minify output js codes
        new UglifyJsPlugin({
            cache: true
        }),

        // generate html5 file for you that includes all your webpack bundles in the body using script tags.
        new HtmlWebpackPlugin({
            template: './assets/index.html'
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        publicPath: '/',
        port: 9001
    }
}