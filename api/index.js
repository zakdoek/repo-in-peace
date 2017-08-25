/**
 * Server entry point
 */

import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { execute, subscribe } from "graphql";
import { graphqlExpress } from "graphql-server-express";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import passport from "passport";
import { ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";
import cors from "cors";

import Strategy from "./utils/OptionalJwtStrategy.js";
import { schema } from "./schema.js";

const LOG_FORMAT = process.env.NODE_ENV === "production" ? "combined" : "dev";
const API_CORS_WHITELIST = process.env.API_CORS_WHITELIST || (
    __DEVELOPMENT__ ? "*" : "");


/**
 * Server
 */
export default function() {
    // Check if secret is present or crash
    if (!process.env.API_JWT_SECRET) {
        console.error("JWT_SECRET not set, can't start!");
        return;
    }

    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

    // Set passport strategy for the api
    passport.use(new Strategy({
        jwtFromRequest,
        passReqToCallback: true,
        secretOrKey: process.env.API_JWT_SECRET,
    }, (req, payload, done) => done(null, {
        profile: payload,
        jwToken: jwtFromRequest(req),
    })));

    // Create server instance
    const app = express();

    // Check for cors whitelist
    app.use(cors({
        origin(requesting, done) {
            if (API_CORS_WHITELIST === "*" ||
                    API_CORS_WHITELIST.indexOf(requesting) >= 0) {
                done(null, true);
            } else {
                done(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }));

    // Enable logging to STDOUT
    app.use(morgan(LOG_FORMAT));

    // Add api server
    app.use(
        "/graphql",
        bodyParser.json(),
        passport.authenticate("jwt", { session: false }),
        graphqlExpress(req => ({
            schema,
            context: { user: req.user },
        })),
    );

    // Wrap express server to support websockets
    const ws = createServer(app);

    // Use native promises
    mongoose.Promise = global.Promise;
    // Connect to database
    /* eslint no-console: 0 */
    console.log(`Connecting to ${process.env.API_MONGO_URL}...`);
    mongoose.connect(process.env.API_MONGO_URL, {
        useMongoClient: true,
    }).then(() => {
        // Start listening
        ws.listen(process.env.API_PORT, () => {
            console.log(
                `Listening for requests on port ${process.env.API_PORT}...`);

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
        console.error(`Could not connect to ${process.env.API_MONGO_URL}!`);
    });
}
