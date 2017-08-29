/* lib/components/Header/Header.js */

import styles from "./Header.scss";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Link } from "react-router-dom";


const AddLink = () => (
    <div className="col col-sm-6 order-1">
        <Link to="/add">+ Add repo</Link>
    </div>
);


const BackButton = () => (
    <div className="col col-sm-6 order-1">
        <Link to="/">&lt;= Back</Link>
    </div>
);


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
            <div className={styles.header}>
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-6 order-12 ml-auto text-right">
                            {loading ? "..." : null}
                            {isLoggedIn ? <a href="/logout">Logout {username}</a> : null}
                            {isLoggedOut ?  <a href="/login">Login</a> : null}
                        </div>
                        {isLoggedIn ? (
                            <Switch>
                                <Route path="/" exact component={AddLink} />
                                <Route path="/add" component={BackButton} />
                            </Switch>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}
