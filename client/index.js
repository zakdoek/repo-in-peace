/**
 * Client entry point
 */

import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, createNetworkInterface } from "react-apollo";
import {
    SubscriptionClient,
    addGraphQLSubscriptions,
} from "subscriptions-transport-ws";

import createStore from "../lib/redux/create.js";
import App from "../lib/containers/App/App.js";

// Create client
const networkInterface = addGraphQLSubscriptions(
    createNetworkInterface({ uri: window.__api }),
    new SubscriptionClient(window.__ws, { reconnect: true }),
);

networkInterface.use([
    {
        applyMiddleware(req, next) {
            if (!window.__extraData.apiToken) {
                return next();
            }

            // Is logged in, augment request header
            req.options.headers = req.options.headers || {};

            // Set bearer token
            req.options.headers.authorization =
                `bearer ${window.__extraData.apiToken}`;

            next();
        },
    },
]);

const client = new ApolloClient({ networkInterface });

// Create store
const store = createStore(client, window.__data);

const ghUser = window.__extraData ? window.__extraData.ghUser : undefined;

// Content
const target = document.getElementById("content");

// Render
ReactDOM.render(
    <App store={store} client={client} ghUser={ghUser} />,
    target,
);
