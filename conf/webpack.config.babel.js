/* conf/webpack.config.babel.js */
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import StyleLintPlugin from "stylelint-webpack-plugin";


const DEVELOPMENT = process.env.NODE_ENV != "production";

// Exctract Text SCSS
const extractStyles = new ExtractTextPlugin("[name].bundle.css");


// Style lint
const styleLintPlugin = new StyleLintPlugin({
    files: [
        "**/*.scss",
    ],
});

export default {
    context: path.resolve(__dirname, "../"),
    entry: {
        client: "./client/index.js",
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
            // Scss
            {
                test: /\.(sass|scss)$/,
                use: extractStyles.extract({
                    use: [
                        {
                            loader: "css-loader",
                            query: {
                                sourceMap: DEVELOPMENT,
                                url: false,
                                modules: true,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            query: {
                                sourceMap: DEVELOPMENT,
                                config: {
                                    path: path.resolve(
                                        __dirname,
                                        "../conf/postcss.config.js",
                                    ),
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            query: {
                                sourceMap: DEVELOPMENT,
                                includePaths: [
                                    process.env.CACHE_DIR || path.resolve(
                                        __dirname, "../.cache"),
                                    path.resolve(__dirname, "../node_modules"),
                                ],
                            },
                        },
                    ],
                }),
            },
            // Image loader
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        query: {
                            name: "[sha512:hash:hex].[ext]",
                            publicPath: "/static/img",
                            outputPath: path.resolve(__dirname, "../build/"),
                        },
                    },
                    {
                        loader: "image-webpack-loader",
                        query: {
                            optimizationLevel: DEVELOPMENT ? 0 : 7,
                            // TODO: Implement better optimizers
                        },
                    }
                ],
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
        path: path.resolve(__dirname, "../build/client"),
        filename: "[name].bundle.js",
    },
    plugins: [
        styleLintPlugin,
        extractStyles,
    ],
    devtool: DEVELOPMENT ? "source-map" : false,
};
