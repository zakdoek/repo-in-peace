/* webpack.config.server.js */
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { DefinePlugin } from "webpack";
import { serverConfiguration } from "universal-webpack";
import favicons from "favicons";

import settings from "./universal-webpack-settings";
import configuration from "./webpack.config.babel.js";

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

/**
 * Generate favicons promise
 */
const ensureFavicons = () => new Promise((resolve, reject) => {
    const staticPath = path.join(process.env.STATIC_URL, "favicons");

    favicons(path.resolve(__dirname, "../server/favicon.png"), {
        background: "#ffffff",
        path: staticPath,
        icons: {
            twitter: false,
            opengraph: false,
        },
    }, (error, response) => {
        if (error) {
            reject(error);
        }

        // Write html
        const htmlPath = path.resolve(__dirname, "../.cache/favicons.html");
        mkdirp.sync(path.dirname(htmlPath));
        fs.writeFileSync(htmlPath, response.html.join("\n"));

        // Write files & images
        const filesPath = path.resolve(__dirname, "../build/client/favicons");
        mkdirp.sync(filesPath);
        for (const file of response.files) {
            fs.writeFileSync(path.join(filesPath, file.name), file.contents);
        }
        for (const image of response.images) {
            fs.writeFileSync(path.join(filesPath, image.name), image.contents);
        }

        resolve();
    });
});


configuration.resolve.modules.unshift(path.resolve(__dirname, "../server"));
configuration.plugins.push(environmentPlugin);
export default () => ensureFavicons().then(
    () => serverConfiguration(configuration, settings));
