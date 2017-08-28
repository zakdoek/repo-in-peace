/* lib/containers/Content/Content.js */

import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../Header/Header.js";


/**
 * The component
 */
export default class Content extends Component {
    // Prop Types
    static propTypes = {
        loggedIn: PropTypes.bool,
    }

    /**
     * Render
     */
    render() {
        const { loggedIn } = this.props;

        return (
            <Header loggedIn={loggedIn} />
        );
    }
}
