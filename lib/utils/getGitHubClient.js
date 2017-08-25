/* lib/utils/getGitHubClient.js */

import "isomorphic-fetch";
import ApolloClient, { createNetworkInterface } from "apollo-client";


/**
 * Construct the github client
 */
export default token => {
    if (!token) {
        return null;
    }

    // Actually construct the client\
    const networkInterface = createNetworkInterface({
        uri: "https://api.github.com/graphql",
    });

    networkInterface.use([{
        applyMiddleware(req, next) {
            // Ensure headers
            req.options.headers = req.options.headers || {};

            // Set bearer token
            req.options.headers.authorization = `bearer ${token}`;

            next();
        },
    }]);

    return new ApolloClient({
        networkInterface,
    });
};
