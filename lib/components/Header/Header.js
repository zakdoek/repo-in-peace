/* lib/components/Header/Header.js */

import React, { Component } from "react";
import PropTypes from "prop-types";


export default class Header extends Component {
    // Props
    static propTypes = {
        username: PropTypes.string,
        loading: PropTypes.bool,
    }

    /**
     * Render
     */
    render(){
        const { username, loading } = this.props;
        const isLoggedIn = !loading && username;
        const isLoggedOut = !loading && !username;

        return (
            <div className="container text-center">
                {loading ? "..." : null}
                {isLoggedIn ? <a href="/logout">Logout {username}</a> : null}
                {isLoggedOut ?  <a href="/login">Login</a> : null}
            </div>
        );
    }
}
