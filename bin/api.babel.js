#! /usr/bin/env node

require("babel-register");
const server = require("./../api/index.js").default;

// Start server
server();
