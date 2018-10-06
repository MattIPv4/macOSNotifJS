const { name, version } = require("./package.json");
const path = require("path").posix;
const webpack = require("webpack");
const os = require("os");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// YYYY-MM-DD format
const dateOfBuild = new Date().toISOString().slice(0, 10);
const copyrights = `/**
 *  macOSNotifJS: A simple Javascript plugin to create simulated macOS notifications on your website.
 *  <https://github.com/MattIPv4/macOSNotifJS/>
 *  Copyright (C) 2018 Matt Cowley (MattIPv4) (me@mattcowley.co.uk)
 */`

module.exports = {
    mode: "production",
    target: "web",
    entry: [
        "core-js/fn/object/entries",
        path.join(__dirname, "src/macOSNotif.js"),
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "macOSNotif.min.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, {
                    loader: "css-loader",
                }],
            },
            {
                test: /\.(ttf|eot|otf|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "./fonts/[name].[ext]",
                    },
                },
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                }],
            },
            {
                test: /\.(ogg|mp3|caf|wav|mpe?g)$/i,
                use: {
                    loader: "url-loader",
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "macOSNotif.min.css",
            allChunks: true,
        }),
        new OptimizeCssAssetsPlugin({}),
        new webpack.BannerPlugin(`${name} - v${version} - ${dateOfBuild}${os.EOL}${copyrights}${os.EOL}`),
        new HtmlWebpackPlugin({
            meta: {
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
            },
            minify: false,
            inject: false,
            xhtml: true,
            filename: path.join(__dirname, "index.html"),
            template: "index.tpl",
        }),
    ],
};
