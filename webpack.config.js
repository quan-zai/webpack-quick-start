var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'assets/main.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: "[id].chunk.js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        port: 9001,
        hot: true,

    }
}