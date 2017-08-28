/* lib/components/DeceasedRepos/DeceasedRepos.js */

import React, { Component } from "react";
import PropTypes from "prop-types";


/**
 * Deceased repo list
 */
export default class DeceasedRepos extends Component {

    // Props
    static propTypes = {
        repos: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    }

    /**
     * Render
     */
    render() {
        return (
            <div className="container">
                REPOS
            </div>
        );
    }
}
