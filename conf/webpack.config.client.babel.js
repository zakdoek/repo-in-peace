/* webpack.config.client.js */
import path from "path";
import { DefinePlugin } from "webpack";
import { clientConfiguration } from "universal-webpack";
import settings from "./universal-webpack-settings";
import configuration from "./webpack.config.babel.js";

const NODE_ENV = JSON.stringify(process.env.NODE_ENV);
const __CLIENT__ = true;
const __SERVER__ = false;
const __DEVELOPMENT__ = NODE_ENV != "production";
const __DISABLE_SSR__ = process.env.DISABLE_SSR || false;

const environmentPlugin = new DefinePlugin({
    "process.env": {
        NODE_ENV,
    },
    __CLIENT__,
    __SERVER__,
    __DEVELOPMENT__,
    __DISABLE_SSR__,
});

configuration.resolve.modules.unshift(path.resolve(__dirname, "../client"));
configuration.plugins.push(environmentPlugin);
export default clientConfiguration(configuration, settings);
