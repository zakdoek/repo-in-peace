/* lib/containers/App/App.js */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
import { StaticRouter, BrowserRouter } from "react-router-dom";


/**
 * Providers
 */
const CombinedProvider = ({ store, client, children }) => (
    <Provider store={store}>
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    </Provider>
);


/**
 * Inner app
 */
const Inner = () => (
    <h1>Hello World</h1>
);


/**
 * Main app
 */
export default class App extends Component {

    // Prop Types
    static propTypes = {
        store: PropTypes.object.isRequired,
        client: PropTypes.object.isRequired,
        routerProps: PropTypes.shape({
            location: PropTypes.string.isRequired,
            context: PropTypes.object.isRequired,
        }),
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
        const { store, client, routerProps } = this.props;

        if (__DEVELOPMENT__ && __CLIENT__) {
            // Import devtools
            const DevTools = require("../DevTools/DevTools.js").default;

            // Enable debugger
            window.React = React;

            return (
                <CombinedProvider client={client} store={store}>
                    <BrowserRouter>
                        <div>
                            <Inner />
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
                            <Inner />
                        </div>
                    </StaticRouter>
                </CombinedProvider>
            );
        } else {
            return (
                <CombinedProvider client={client} store={store}>
                    <BrowserRouter>
                        <div>
                            <Inner />
                        </div>
                    </BrowserRouter>
                </CombinedProvider>
            );
        }
    }
}
