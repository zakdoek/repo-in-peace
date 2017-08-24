/**
 * Server entry point
 */

import path from "path";
import url from "url";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import React from "react";
import { renderToString } from "react-dom/server";
import { ApolloClient, createNetworkInterface } from "react-apollo";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import cookieSession from "cookie-session";

import createStore from "../lib/redux/create.js";
import App from "../lib/containers/App/App.js";

import Html from "./utils/Html.js";

const LOG_FORMAT = process.env.NODE_ENV === "production" ? "combined" : "dev";
const STATIC_DIR = path.resolve(__dirname, "../client");


/**
 * Server
 */
export default function() {

    // Passport session serializers
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // Passport session serializers
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    // Set the passport strategy for front server
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: url.resolve(process.env.FRONT_URL, "auth/cb"),
    }, (accessToken, _, __, done) => done(null, accessToken)));

    // Create server instance
    const app = express();

    // Enable logging to STDOUT
    app.use(morgan(LOG_FORMAT));

    // Add compression
    app.use(compression());

    // Add static
    app.use("/static/", express.static(STATIC_DIR));

    // Initialize the session
    app.use(cookieSession({
        name: "fs", // front session
        keys: [process.env.SESSION_SECRET],

        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }));

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    // Front auth cb url
    app.get("/auth/cb",
        passport.authenticate("github", {
            failureRedirect: "/",
        }),
        (_, res) => res.redirect("/"),
    );

    // Login
    app.get("/login",
        passport.authenticate("github", {
            scope: [
                "user",
                "public_repo",
                "repo",
                "repo_deployment",
                "repo:status",
                "read:repo_hook",
                "read:org",
                "read:public_key",
                "read:gpg_key",
            ],
        }),
        (_, res) => res.redirect("/"),
    );

    // Logout
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    // Frontend server
    app.get(/.*/,
        (req, res) => {

            // If ssr is disabled, render without component or store to rehydrate
            if (__DISABLE_SSR__) {
                res.send(
                    `<!doctype html>\n
                    ${renderToString(<Html />)}`
                );
                return;
            }

            // TODO: Pass the user token console.log("User", req.user);

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
            // Inject GitHub token. Will be used to login into the GraphQl API
            res.send(
                `<!doctype html>
                ${renderToString(<Html component={component} store={store} />)}`
            );
        },
    );

    app.listen(process.env.PORT, () => {
        /* eslint no-console: 0 */
        console.log(`Listening for requests on port ${process.env.PORT}...`);
    });
}
