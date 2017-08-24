/* conf/webpack.config.babel.js */

import path from "path";
import webpack from "webpack";
import { is_external } from "universal-webpack/build/server configuration.js";


const DEVELOPMENT = process.env.NODE_ENV != "production";


const configuration = {
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    context: path.resolve(__dirname, "../"),
    entry: {
        api: "./api/index.js",
    },
    module: {
        rules: [
            // Javascripts
            {
                test: /\.js$/,
                use: ["eslint-loader"],
                enforce: "pre",
            },
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: "babel-loader",
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "../lib"),
            path.resolve(__dirname, "../.cache"),
            path.resolve(__dirname, "../node_modules"),
        ]
    },
    output: {
        path: path.resolve(__dirname, "../build/api"),
        filename: "[name].js",
        chunkFilename: "[name].js",
        libraryTarget: "commonjs2",
        pathinfo: true,
    },
    devtool: DEVELOPMENT ? "source-map" : false,
    externals: [
        (context, request, callback) => {
            if (is_external(request, configuration, {})) {
                // Resolve dependency as external
                return callback(null, request);
            }

            // Resolve dependency as non-external
            return callback();
        },
    ],
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    ],
};


export default configuration;
