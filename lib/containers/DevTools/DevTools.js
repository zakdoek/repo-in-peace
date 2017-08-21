/* containers/DevTools/DevTools.js */

import React from "react";
import { createDevTools } from "redux-devtools";
import DockMonitor from "redux-devtools-dock-monitor";
import LogMonitor from "redux-devtools-log-monitor";


/**
 * DevTools
 */
export default createDevTools(
    <DockMonitor
        toggleVisibilityKey="ctrl-H"
        changePositionKey="ctrl-Q"
        defaultIsVisible={false}>
        <LogMonitor />
    </DockMonitor>
);
