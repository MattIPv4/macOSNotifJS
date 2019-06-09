const { version, description } = require("./package.json");
const path = require("path").posix;
const webpack = require("webpack");
const os = require("os");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// YYYY-MM-DD format
const dateOfBuild = new Date().toISOString().slice(0, 10);
const name = "macOSNotifJS";
const versionInfo = `${name} - v${version} - ${dateOfBuild}`;
const copyrights = `${name}: ${description}
<https://github.com/MattIPv4/macOSNotifJS/>
Copyright (C) 2019 Matt Cowley (MattIPv4) (me@mattcowley.co.uk)`;

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
        new webpack.BannerPlugin(`${versionInfo}${os.EOL}${os.EOL}${copyrights}${os.EOL}`),
    ],
};
