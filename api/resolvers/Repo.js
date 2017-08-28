/* server/api/resolvers/Repo.js */

import UserModel from "../models/User.js";


/**
 * Repo resolvers
 */
export default {
    hasVoted: (root, _, { user }) => root.hasVoted(user),
    owner: root => UserModel.findById(root.owner),
};
