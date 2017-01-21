const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const isProduction = process.env.NODE_ENV === 'production';

const config = {
    performance: {
        maxAssetSize: 10 * 1000 * 1024,
        maxEntrypointSize: 10 * 1000 * 1024
    },
    entry: {
        vendor: [
            'babel-polyfill',
            'moment',
            'jquery',
            'angular'
        ],
        styles: [
            './src/less/styles.less',
        ],
        app: [
            './src/App.js'
        ]
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },

    resolve: {
        extensions: ['.js'],
    },

    module: {
        rules: [
            { test: require.resolve('moment'), loader: 'expose-loader?moment' },
            { test: require.resolve('jquery'), loader: 'expose-loader?jQuery!expose-loader?$' },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
                include: path.join(__dirname, 'src'),
            },
            {
                test: /\.html$/,
                use: ['ngtemplate-loader', 'html-loader'],
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                    ],
                }),
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'less-loader?root=true',
                        },
                    ],
                }),
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                }),
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
            { test: /\.png?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
            { test: /\.json$/, loader: 'json-loader'},
        ],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity,
        }),

        new ExtractTextPlugin('[name].css'),

        new webpack.LoaderOptionsPlugin({
            options: {
                lessLoader: {
                    lessPlugins: [
                        require('less-plugin-glob'),
                    ],
                },
            },
        }),

    ],
};

console.log('====== IS PRODUCTION: ' + isProduction + ' ======');
if (isProduction) {
    config.devtool = 'source-map';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: isProduction,
    }));
    config.plugins.push(new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } }
    }));
}

module.exports = config;
