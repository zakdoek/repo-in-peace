/* server/api/resolvers/Query/repos.js */

import RepoModel from "../../models/Repo.js";


/**
 * Repos query
 */
export default () => RepoModel.find().populate("owner").populate({
    path: "votes",
    populate: {
        path: "user",
    },
}).then(repos => repos);
