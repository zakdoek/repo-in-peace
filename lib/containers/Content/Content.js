/* lib/containers/Content/Content.js */

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";

import Header from "../Header/Header.js";
import AddRepo from "../AddRepo/AddRepo.js";
import DeceasedRepos from "../DeceasedRepos/DeceasedRepos.js";


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
            <div>
                <Header loggedIn={loggedIn} />
                <Switch>
                    <Route path="/" exact component={DeceasedRepos} />
                    {loggedIn ? (
                        <Route path="/add" exact component={AddRepo} />
                    ) : null}
                    <Route path="*" render={() => (
                        <div className="container">
                            <h1>Not Found</h1>
                        </div>
                    )} />
                </Switch>
            </div>
        );
    }
}
