const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const webpack = require('webpack')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = webpackMerge(commonConfig, {
    plugin: [

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
                'NODE_ENV': JSON.stringify('sit'),
            }
        })
    ]
})