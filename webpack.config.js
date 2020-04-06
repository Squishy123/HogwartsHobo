const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    entry: {
        index: path.join(__dirname, "src/main.js"),
    },
    output: {
        path: path.join(__dirname, "dep"),
        filename: "[name].bundle.js",
    },
    devServer: {
        watchContentBase: true,
        contentBase: [
            path.join(__dirname, "src"),
        ],
        inline: true,
        hot: true,
        compress: true,
        port: 8000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            filename: "index.html",
            template: path.join(__dirname, "src/index.html"),
            chunks: ["index"],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        esModule: false,
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }],
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js"],
    },
}