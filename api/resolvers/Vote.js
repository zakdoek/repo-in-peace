/* api/resolvers/Vote.js */

import UserModel from "../models/User.js";
import RepoModel from "../models/Repo.js";


/**
 * Vote resolvers
 */
export default {
    user: root => UserModel.findById(root.user),
    repo: root => RepoModel.findById(root.repo),
};
