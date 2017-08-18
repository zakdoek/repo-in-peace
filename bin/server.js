/* bin/server.js */

import { server } from "universal-webpack";
import settings from "../conf/universal-webpack-settings.json";
import configuration from "../conf/webpack.config.babel.js";

server(configuration, settings);
