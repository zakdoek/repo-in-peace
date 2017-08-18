/* helpers/Html.js */

import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom/server";
import serialize from "serialize-javascript";
import Helmet from "react-helmet";

import staticPath, {STATIC_PREFIX} from "../utils/static.js";

import Favicons from "./Favicons.js";

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn"t (and can"t) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
    static propTypes = {
        component: PropTypes.element,
        store: PropTypes.object,
    };

    /**
     * Render the page
     */
    render() {
        const {component, store} = this.props;
        const content = component ? ReactDOM.renderToString(component) : "";
        const head = Helmet.rewind();

        return (
            <html lang="nl-be">
                <head>
                    {head.base.toComponent()}
                    {head.title.toComponent()}
                    {head.meta.toComponent()}
                    {head.link.toComponent()}
                    {head.script.toComponent()}

                    {Favicons}

                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="stylesheet" href={staticPath("client.bundle.css")} />
                </head>
                <body>
                    {/* Content */}
                    <div id="content" dangerouslySetInnerHTML={{__html: content}} />


                    {/* Set global variables */}
                    <script dangerouslySetInnerHTML={{__html: `window.__static="${STATIC_PREFIX}";`}} charSet="UTF-8" />
                    <script dangerouslySetInnerHTML={{__html: `window.__api="${process.env.API_URL}";`}} charSet="UTF-8" />

                    {/* Save store data for rehydration */}
                    {store ? (
                        <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8" />
                    ) : null}

                    {/* Set the main script */}
                    <script src={staticPath("client.bundle.js")} charSet="UTF-8"/>
                </body>
            </html>
        );
    }
}
