/* helpers/favicons.js */

import fs from "fs";
import path from "path";
import React from "react";

const faviconsStringCachePath = path.resolve(
    __dirname, "../../.cache/favicons.html");

const faviconsString = fs.readFileSync(faviconsStringCachePath, "utf-8");


/**
 * Convert raw html to components
 */
const stringToComponents = (string) => {
    // stop if str is empty
    if (!string.length) {
        return null;
    }

    const components = [];

    string.split(/\n/).forEach((node, i) => {

        if (!node.length) {
            return;
        }

        // extrapolate node type
        let nodeType = string.match(/[a-z]+/)[0];

        // container for props
        let props = {
            key: i
        };

        // match attr="value" pattern
        // store props
        node.match(/([a-z-]+=".*?")/g).forEach((attr) => {
            let matches = attr.match(/([a-z-]+)="(.*?)"/);
            props[matches[1]] = matches[2];
        });

        // create and save the component
        components.push(React.createElement(nodeType, props));

    });

    return components;
};


const Favicons = stringToComponents(faviconsString);


export default Favicons;
