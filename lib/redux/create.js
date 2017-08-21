/* redux/create.js */

import { createStore, compose } from "redux";

import reducer from "./modules/reducer.js";

/**
 * Create a store
 */
export default data => {

    // Inject devtools
    if (__DEVELOPMENT__ && __CLIENT__) {
        const { persistState } = require("redux-devtools");
        const DevTools = require("../containers/DevTools/DevTools.js").default;

        return compose(
            window.devToolsExtension ?
                window.devToolsExtension() : DevTools.instrument(),
            persistState(
                window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
        )(createStore)(reducer, data);
    }

    return createStore(reducer, data);
};
