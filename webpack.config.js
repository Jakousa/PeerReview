const config = require('./config')
const webpack = require('webpack')

module.exports = {
    mode: config.NODE_ENV,
    entry: './client/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
}
