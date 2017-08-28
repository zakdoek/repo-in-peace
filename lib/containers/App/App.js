/* lib/containers/App/App.js */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticRouter, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { ApolloProvider, graphql, gql } from "react-apollo";
import { ApolloProvider } from "react-apollo";
import { withContext } from "recompose";

import getGitHubClient from "../../../lib/utils/getGitHubClient.js";

import Header from "../../components/Header/Header.js";


/**
 * Inner app
 */
const Inner = ({ ghUser }) => (
    <Header username={ghUser ? ghUser.username : null} />
);


/**
 * Combined redux and multi client apollo provider
 */
class CombinedProvider extends Component {

    // prop types
    static propTypes = {
        store: PropTypes.object.isRequired,
        client: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired,
    };

    /**
     * Render
     */
    render() {
        const { store, client, children } = this.props;

        return (
            <Provider store={store}>
                <ApolloProvider client={client} store={store}>
                    {children}
                </ApolloProvider>
            </Provider>
        );
    }
}


/**
 * Main app
 */
class App extends Component {

    // Prop Types
    static propTypes = {
        store: PropTypes.object.isRequired,
        client: PropTypes.object.isRequired,
        routerProps: PropTypes.shape({
            location: PropTypes.string.isRequired,
            context: PropTypes.object.isRequired,
        }),
        ghUser: PropTypes.object,
        user: PropTypes.object,
    }

    // Initial state
    state = {
        isMounted: false,
    }

    /**
     * On Component mount on client side
     */
    componentDidMount() {
        this.setState({
            isMounted: true,
        });
    }

    /**
     * Render
     */
    render() {
        const { store, client, ghUser, routerProps } = this.props;

        if (__DEVELOPMENT__ && __CLIENT__) {
            // Import devtools
            const DevTools = require("../DevTools/DevTools.js").default;

            // Enable debugger
            window.React = React;

            return (
                <CombinedProvider client={client} store={store}>
                    <BrowserRouter>
                        <div>
                            <Inner ghUser={ghUser} />
                            {this.state.isMounted && <DevTools />}
                        </div>
                    </BrowserRouter>
                </CombinedProvider>
            );
        } else if (__SERVER__) {
            return (
                <CombinedProvider client={client} store={store}>
                    <StaticRouter {...routerProps}>
                        <div>
                            <Inner ghUser={ghUser} />
                        </div>
                    </StaticRouter>
                </CombinedProvider>
            );
        } else {
            return (
                <CombinedProvider client={client} store={store}>
                    <BrowserRouter>
                        <div>
                            <Inner ghUser={ghUser} />
                        </div>
                    </BrowserRouter>
                </CombinedProvider>
            );
        }
    }

    /**
     * Login and reset store
     */
    login() {

    }

    /**
     * Logout and reset store
     */
    logout() {

    }
}


/**
 * Add github client to context
 */
const AppWithContext = withContext(
    // Child Context Types
    { ghClient: PropTypes.object },
    // Map the context from the prop
    ({ ghUser }) => ({ ghClient: getGitHubClient(
        ghUser && ghUser.token ? ghUser.token : null )}),
)(App);


// Login to API
// const API_LOGIN = gql`
// mutation Login($ghToken: String!) {
//     login(ghToken: $ghToken) {
//         username
//         token
//     }
// }
// `;


/**
 * With API user injected
 */
// const AppWithUser = graphql(API_LOGIN, {
//     skip: ({ ghUser }) => !(ghUser && ghUser.token),
//     props({ data, error, loading }) {
//         // When no token, return as logged out
//     },
// })


export default AppWithContext;
