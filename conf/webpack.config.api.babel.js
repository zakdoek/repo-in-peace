/* conf/webpack.config.babel.js */

import path from "path";
import webpack, { DefinePlugin } from "webpack";
import { is_external } from "universal-webpack/build/server configuration.js";


const DEVELOPMENT = process.env.NODE_ENV != "production";

const __CLIENT__ = false;
const __SERVER__ = true;
const __DEVELOPMENT__ = process.env.NODE_ENV != "production";
const __DISABLE_SSR__ = process.env.DISABLE_SSR || false;

const environmentPlugin = new DefinePlugin({
    __CLIENT__,
    __SERVER__,
    __DEVELOPMENT__,
    __DISABLE_SSR__,
});

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
        environmentPlugin,
    ],
};


export default configuration;
