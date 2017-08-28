/* lib/components/Header/Header.js */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


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
            <div className="container">
                <div className="row">
                    <div className="col col-sm-6 order-12 ml-auto text-right">
                        {loading ? "..." : null}
                        {isLoggedIn ? <a href="/logout">Logout {username}</a> : null}
                        {isLoggedOut ?  <a href="/login">Login</a> : null}
                    </div>
                    {isLoggedIn ? (
                        <div className="col col-sm-6 order-1">
                            <Link to="/add">+ Add repo</Link>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
