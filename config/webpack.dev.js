const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const webpack = require('webpack')
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].js',
    },

    module: {
        rules: [
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
        ]
    },

    plugins: [
        // 在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。通过指定 entry 配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中, 防止引起无关chunk的更新
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            filename: '[name].js',
            minChunks: Infinity
        }),

        // css单独打包成chunk
        new ExtractTextPlugin({
            filename: "styles/[name].css",
            allChunks: true
        }),

        // hot module replace
        new webpack.HotModuleReplacementPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev'),
            }
        })
    ],

    // 若使用ExtractTextPlugin，DevServer中的hot=true参数要去掉，否则css文件无法热更新
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        port: 9001,
        inline: true
    }
})