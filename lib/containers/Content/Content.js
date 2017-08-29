/* lib/containers/Content/Content.js */

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { graphql, gql } from "react-apollo";

import Header from "../Header/Header.js";
import AddRepo from "../AddRepo/AddRepo.js";
import DeceasedRepos from "../DeceasedRepos/DeceasedRepos.js";


const CURRENT_USER = gql`
query CurrentUser {
    viewer {
        id
        username
    }
}
`;


const currentUserQuery = graphql(CURRENT_USER, {
    skip: ({ loggedIn }) => !loggedIn,
    props: ({ data: { viewer }, loading }) => ({
        viewer,
        loading,
    }),
});


/**
 * The component
 */
class Content extends Component {
    // Prop Types
    static propTypes = {
        loggedIn: PropTypes.bool,
    }

    /**
     * Render
     */
    render() {
        const { loggedIn, viewer, loading } = this.props;

        return (
            <div>
                <Header
                    loggedIn={loggedIn}
                    username={viewer ? viewer.username : null}
                    loading={loading}
                />
                <Switch>
                    <Route path="/" exact render={() => (
                        <DeceasedRepos loggedIn={loggedIn} />
                    )} />
                    {loggedIn ? (
                        <Route
                            path="/add" exact
                            render={() => (<AddRepo user={viewer} />)}
                        />
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


export default currentUserQuery(Content);
