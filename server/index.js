/**
 * Server entry point
 */

import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import React from "react";
import { renderToString } from "react-dom/server";
import { ApolloClient, createNetworkInterface } from "react-apollo";
import bodyParser from "body-parser";
import { execute, subscribe } from "graphql";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import passport from "passport";
import { ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";

import createStore from "../lib/redux/create.js";
import App from "../lib/containers/App/App.js";

import Strategy from "./utils/OptionalJwtStrategy.js";
import Html from "./utils/Html.js";
import { schema } from "./api/schema.js";

const LOG_FORMAT = process.env.NODE_ENV === "production" ? "combined" : "dev";
const STATIC_DIR = path.resolve(__dirname, "../client");


/**
 * Server
 */
export default function() {
    // Check if secret is present or crash
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not set, can't start!");
        return;
    }

    // Set passport strategy
    passport.use(new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    }, (payload, done) => done(null, payload)));

    // Create server instance
    const app = express();

    // Enable logging to STDOUT
    app.use(morgan(LOG_FORMAT));

    // Add compression
    app.use(compression());

    // Add static
    app.use("/static/", express.static(STATIC_DIR));

    // Add api server
    app.use(
        "/graphql",
        bodyParser.json(),
        passport.authenticate("jwt", { session: false }),
        graphqlExpress({
            schema,
        }),
    );

    if (__DEVELOPMENT__) {
        app.use("/graphiql", graphiqlExpress({
            endpointURL: process.env.API_URL,
            subscriptionsEndpoint: process.env.WS_URL,
        }));
    }

    // Dummy
    app.get(/.*/, (req, res) => {

        // If ssr is disabled, render without component or store to rehydrate
        if (__DISABLE_SSR__) {
            res.send(
                `<!doctype html>\n
                ${renderToString(<Html />)}`
            );
            return;
        }

        // Create redux store, no data available yet
        const store = createStore();

        // Create client
        const networkInterface = createNetworkInterface({
            uri: process.env.API_URL,
        });
        const client = new ApolloClient({ networkInterface });

        // Pass request to App container
        const routerContext = {};
        const routerProps = {
            location: req.url,
            context: routerContext,
        };

        // Render full
        const component = (
            <App store={store} client={client} routerProps={routerProps} />
        );

        // Check context for different response code
        if (routerContext.url) {
            res.redirect(routerContext.url);
            return;
        }
        // Send response
        res.send(
            `<!doctype html>
            ${renderToString(<Html component={component} store={store} />)}`
        );
    });

    // Wrap express server to support websockets
    const ws = createServer(app);

    // Use native promises
    mongoose.Promise = global.Promise;
    // Connect to database
    /* eslint no-console: 0 */
    console.log(`Connecting to ${process.env.MONGO_URL}...`);
    mongoose.connect(process.env.MONGO_URL, {
        useMongoClient: true,
    }).then(() => {
        // Start listening
        ws.listen(process.env.PORT, () => {
            console.log(
                `Listening for requests on port ${process.env.PORT}...`);

            // Set up the WebSocket for handling GraphQL subscriptions
            new SubscriptionServer({
                execute,
                subscribe,
                schema
            }, {
                server: ws,
                path: "/subscriptions",
            });
        });
    }).catch(() => {
        console.error(`Could not connect to ${process.env.MONGO_URL}!`);
    });
}
