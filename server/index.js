/**
 * Server entry point
 */

import path from "path";
import url from "url";
import "babel-polyfill";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    ApolloClient,
    createNetworkInterface,
    renderToStringWithData,
    gql,
} from "react-apollo";
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
    }, (accessToken, _, { username }, done) => done(null, {
        token: accessToken,
        username,
    }),
    ));

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
        (req, res) => {
            // Auth with api add add to session

            // Create client
            const networkInterface = createNetworkInterface({
                uri: process.env.API_URL,
            });

            const client = new ApolloClient({
                networkInterface,
                ssrMode: true,
            });

            client.mutate({
                mutation: gql`
                mutation Login($ghToken: String!) {
                    login(ghToken: $ghToken) {
                        token
                    }
                }
                `,
                variables: {
                    ghToken: req.user.token,
                }
            }).then(({ data: { login: { token } } }) => {
                // Set session
                req.session.apiToken = token;

                return res.redirect("/");
            });
        },
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

        // Clear session
        req.session.passport = null;
        req.session.apiToken = null;
        res.clearCookie("fs");
        res.clearCookie("fs.sig");

        res.redirect("/");
    });

    // Frontend server
    app.get(/.*/,
        (req, res) => {

            // If ssr is disabled, render without component or store to rehydrate
            if (__DISABLE_SSR__) {
                res.send(
                    `<!doctype html>\n
                    ${renderToStaticMarkup(<Html />)}`
                );
                return;
            }

            // Create client
            const networkInterface = createNetworkInterface({
                uri: process.env.API_URL,
            });

            // Add auth if possible
            networkInterface.use([
                {
                    applyMiddleware(cReq, next) {
                        // Test if logged in
                        if (!req.session.apiToken) {
                            return next();
                        }

                        // Is logged in, augment request header
                        cReq.options.headers = cReq.options.headers || {};

                        // Set bearer token
                        cReq.options.headers.authorization =
                            `bearer ${req.session.apiToken}`;

                        next();
                    },
                },
            ]);

            const client = new ApolloClient({
                networkInterface,
                ssrMode: true,
            });

            // Create redux store, no data available yet
            const store = createStore(client);

            // Pass request to App container
            const routerContext = {};
            const routerProps = {
                location: req.url,
                context: routerContext,
            };

            // Render full
            const component = (
                <App
                    store={store}
                    client={client}
                    ghUser={req.user}
                    routerProps={routerProps}
                />
            );

            // Check context for different response code
            if (routerContext.url) {
                res.redirect(routerContext.url);
                return;
            }

            // Populate extradata
            const extraData = {};
            if (req.user) {
                extraData.ghUser = req.user;
            }
            if (req.session.apiToken) {
                extraData.apiToken = req.session.apiToken;
            }

            renderToStringWithData(component).then(content => {

                console.log(store.getState());

                // Create output component
                const output = (
                    <Html
                        content={content}
                        store={store}
                        extraData={extraData}
                    />
                );

                // Send response
                // Inject GitHub token. Will be used to login into the GraphQl API
                res.send(
                    `<!doctype html>
                    ${renderToStaticMarkup(output)}`
                );
            });
        },
    );

    app.listen(process.env.PORT, () => {
        /* eslint no-console: 0 */
        console.log(`Listening for requests on port ${process.env.PORT}...`);
    });
}
