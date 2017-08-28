/* lib/components/Header/Header.js */

import React, { Component } from "react";
import PropTypes from "prop-types";


export default class Header extends Component {
    // Props
    static propTypes = {
        username: PropTypes.string,
        // login: PropTypes.function.isRequired,
        // logout: PropTypes.function.isRequired,
    }

    /**
     * Render
     */
    render(){
        const { username } = this.props;

        return (
            <div className="container text-right">
                {username ? (
                    <a href="/logout">Logout {username}</a>
                ) : (
                    <a href="/login">Login</a>
                )}
            </div>
        );
    }
}
