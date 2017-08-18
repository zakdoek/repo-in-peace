module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    // Create server instance
    var app = (0, _express2.default)();

    // Enable logging to STDOUT
    app.use((0, _morgan2.default)(LOG_FORMAT));

    // Add compression
    app.use((0, _compression2.default)());

    // Add static
    app.use("/static/", _express2.default.static(STATIC_DIR));

    // Dummy
    app.get("/", function (req, res) {
        res.send("Hello Server");
    });

    // Start listening
    app.listen(process.env.PORT, function () {
        /* eslint no-console: 0 */
        console.log("Listening for requests on port " + process.env.PORT + "...");
    });
};

var _path = __webpack_require__(/*! path */ 1);

var _path2 = _interopRequireDefault(_path);

var _express = __webpack_require__(/*! express */ 2);

var _express2 = _interopRequireDefault(_express);

var _compression = __webpack_require__(/*! compression */ 3);

var _compression2 = _interopRequireDefault(_compression);

var _morgan = __webpack_require__(/*! morgan */ 4);

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Server entry point
 */

var LOG_FORMAT = process.env.NODE_ENV === "production" ? "combined" : "dev";
var STATIC_DIR = _path2.default.resolve(__dirname, "../client");

/**
 * Server
 */

/***/ }),
/* 1 */
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 4 */
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map