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

import getGitHubClient from "../lib/utils/getGitHubClient.js";
import createStore from "../lib/redux/create.js";
import App from "../lib/containers/App/App.js";

// Create store
const store = createStore(window.__data);

// Create client
const networkInterface = addGraphQLSubscriptions(
    createNetworkInterface({ uri: window.__api }),
    new SubscriptionClient(window.__ws, { reconnect: true }),
);

const client = new ApolloClient({ networkInterface });

const ghUser = window.__extraData ? window.__extraData.ghUser : undefined;

// Content
const target = document.getElementById("content");

// Render
ReactDOM.render(
    <App
        store={store}
        client={client}
        ghClient={getGitHubClient(
            ghUser ? ghUser.token || undefined : undefined)}
    />,
    target,
);
