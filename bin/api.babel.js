#! /usr/bin/env node

require("babel-register");
const server = require("./../build/api/api.js").default;

// Start server
server();
