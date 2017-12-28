const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = webpackMerge(commonConfig, {
    plugins: [
        // css单独打包成chunk
        new ExtractTextPlugin({
            filename: "styles/[name].css",
            allChunks: true
        }),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev'),
            }
        })
    ],

    // 若使用ExtractTextPlugin，DevServer中的hot=true参数要去掉，否则css文件无法热更新
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        publicPath: '/',
        port: 9001,
        inline: true
    }
})