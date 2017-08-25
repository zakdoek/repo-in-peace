/* lib/containers/App/App.js */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticRouter, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
// import { withContext } from "recompose";

import Header from "../../components/Header/Header.js";


/**
 * Inner app
 */
const Inner = () => (
    <Header />
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
                <ApolloProvider client={client}>
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
        ghClient: PropTypes.object,
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


/**
 * Add github client to context
 *
 * TODO: Research workload and flow of using gh api directly in client
 */
// export default withContext(
//     // Child Context Types
//     { githubClient: PropTypes.object },
//     // Map the context from the prop
//     ({ githubClient }) => ({ githubClient }),
// )(App);
export default App;
