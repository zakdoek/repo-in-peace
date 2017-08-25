/* server/api/resolvers/Mutation/login.js */

import gql from "graphql-tag";
import { sign } from "jsonwebtoken";

import getGitHubClient from "../../../lib/utils/getGitHubClient.js";

import UserModel from "../../models/User.js";


/**
 * Login mutation
 */
export default function login(_, { ghToken }, { user }) {
    // Try to fetch from JWT
    if (user && user.profile && ghToken === user.profile.token) {
        // Return unchanged
        return {
            id: user.profile.id,
            username: user.profile.username,
            token: user.jwToken,
        };
    }

    // Is not auth, try to auth => Check on ghToken validity
    const ghClient = getGitHubClient(ghToken);

    if (!ghClient) {
        throw new Error("Login failed");
    }

    // Fetch uname from GH
    return ghClient.query({
        query: gql`
            query {
                viewer {
                    name
                }
            }
         `,
    }).then(({ data: { viewer: { name: username } } }) => {
        // Create or update in db
        return UserModel.findOne({ username }).then(userDoc => {
            if (userDoc) {
                return {
                    token: sign({
                        id: userDoc.id,
                        token: ghToken,
                        username,
                    }, process.env.API_JWT_SECRET),
                    username,
                    id: userDoc.id,
                };
            }

            userDoc = new UserModel({ username });
            return userDoc.save().then(userDoc => ({
                token: sign({
                    id: userDoc.id,
                    token: ghToken,
                    username,
                }, process.env.API_JWT_SECRET),
                username,
                id: userDoc.id,
            }));
        });
    });
}
