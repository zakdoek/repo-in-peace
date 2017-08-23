/* server/api/resolvers/Mutation/addRepo.js */

import RepoModel from "../../models/Repo.js";


/**
 * addRepo resolver
 */
export default function addRepo(_, { url }, { user }) {
    if (!user) {
        throw new Error("Must be authenticated to post a repo!");
    }

    const newRepo = new RepoModel({
        url,
        owner: user.id,
    });
    newRepo.save();

    return newRepo;
}
