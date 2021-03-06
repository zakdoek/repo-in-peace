/* helpers/Html.js */

import React, { Component } from "react";
import PropTypes from "prop-types";
import serialize from "serialize-javascript";
import Helmet from "react-helmet";

import staticPath, { STATIC_PREFIX } from "../../lib/utils/static.js";

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
        content: PropTypes.string,
        store: PropTypes.object,
        extraData: PropTypes.object,
    }

    static defaultProps = {
        content: "",
    }

    /**
     * Render the page
     */
    render() {
        const {content, store, extraData} = this.props;
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

                    {/* Bootstrap */}
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />

                    <link rel="stylesheet" href={staticPath("client.bundle.css")} />
                </head>
                <body>
                    {/* Content */}
                    <div id="content" dangerouslySetInnerHTML={{__html: content}} />


                    {/* Set global variables */}
                    <script dangerouslySetInnerHTML={{__html: `window.__static="${STATIC_PREFIX}";`}} charSet="UTF-8" />
                    <script dangerouslySetInnerHTML={{__html: `window.__api="${process.env.API_URL}";`}} charSet="UTF-8" />
                    <script dangerouslySetInnerHTML={{__html: `window.__ws="${process.env.API_WS_URL}";`}} charSet="UTF-8" />

                    {/* Save store data for rehydration */}
                    {store ? (
                        <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8" />
                    ) : null}

                    {/* Set extra data to be used when bootstrapping */}
                    {extraData ? (
                        <script dangerouslySetInnerHTML={{__html: `window.__extraData=${serialize(extraData)};`}} charSet="UTF-8" />
                    ) : null}

                    {/* Set the main script */}
                    <script src={staticPath("client.bundle.js")} charSet="UTF-8"/>

                    {/* Add bootstrap stuff */}
                    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>

                </body>
            </html>
        );
    }
}
