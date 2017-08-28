/* redux/create.js */

import { applyMiddleware, createStore, compose } from "redux";

import getReducer from "./modules/reducer.js";

/**
 * Create a store
 */
export default (client, data) => {

    // Inject devtools
    if (__DEVELOPMENT__ && __CLIENT__) {
        const { persistState } = require("redux-devtools");
        const DevTools = require("../containers/DevTools/DevTools.js").default;

        return compose(
            applyMiddleware(client.middleware()),
            window.devToolsExtension ?
                window.devToolsExtension() : DevTools.instrument(),
            persistState(
                window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
        )(createStore)(getReducer(client), data);
    }

    return compose(
        applyMiddleware(client.middleware()),
    )(createStore)(getReducer(client), data);
};
