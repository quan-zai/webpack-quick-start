const webpackMerge = require('webpack-merge')
const commonConfig = require('../webpack.common')
const webpack = require('webpack')
const path = require('path');
const os = require('os')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = webpackMerge(commonConfig, {
    // devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js',
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
                            name: 'img/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
        ]
    },

    plugins: [
        // 在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest(引导程序) 提取出来。通过指定 entry 配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中, 防止引起无关chunk的更新
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            filename: '[name].[hash].js',
            minChunks: Infinity        // 保证没有其他的模块被打包进manifest
        }),

        // css单独打包成chunk
        new ExtractTextPlugin({
            filename: "styles/[name].[contenthash].css",
            allChunks: true
        }),

        // TODO 压缩后热更新时报错，只在生产环境中使用
        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            mangle: true,
            compressor: {
                warnings: false,
                drop_console: true,
                drop_debugger: true
            }
        }),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('product'),
            }
        })
    ]
})