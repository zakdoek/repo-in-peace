/* server/api/resolvers/Repo.js */

import UserModel from "../models/User.js";


/**
 * Repo resolvers
 */
export default {
    hasVoted: (root, _, { user }) => user && user.profile ?
        root.hasVoted(user.profile.id) : false,
    owner: root => UserModel.findById(root.owner),
};
