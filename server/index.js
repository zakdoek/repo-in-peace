/**
 * Server entry point
 */

import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";

const LOG_FORMAT = process.env.NODE_ENV === "production" ? "combined" : "dev";
const STATIC_DIR = path.resolve(__dirname, "../client");


/**
 * Server
 */
export default function() {
    // Create server instance
    const app = express();

    // Enable logging to STDOUT
    app.use(morgan(LOG_FORMAT));

    // Add compression
    app.use(compression());

    // Add static
    app.use("/static/", express.static(STATIC_DIR));

    // Dummy
    app.get("/", (req, res) => {
        res.send("Hello Server");
    });

    // Start listening
    app.listen(process.env.PORT, () => {
        /* eslint no-console: 0 */
        console.log(`Listening for requests on port ${process.env.PORT}...`);
    });
}
