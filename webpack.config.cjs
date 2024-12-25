const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {

    let port;
    switch (env.env) {
        case 'cli81':
            port = 8081;
            break;
        case 'cli80':
        default:
            port = 8080;
            break;
    }

    return {
        mode: 'development',
        devtool: 'source-map',
        entry: './src/index.tsx',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.SCRIPT_PATH': JSON.stringify(process.env.SCRIPT_PATH),
                'process.env.apiUrl': JSON.stringify(`http://localhost:${port}`),
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                inject: false,
                templateParameters: {
                    SCRIPT_PATH: process.env.SCRIPT_PATH || '/main.js'
                }
            }),
        ]
    }
};
