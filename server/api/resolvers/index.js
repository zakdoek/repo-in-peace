/* server/api/resolvers/index.js */

import Repo from "../models/Repo.js";


export default {
    Query: {
        repos: () => Repo.find({}).populate("owner").populate({
            path: "votes",
            populate: {
                path: "user",
            },
        }).then(repos => {
            // Construct gql objects
            return repos;
        }),
    },
    Mutation: {
        addRepo(_, { url }, { req: { user } }) {
            if (!user || !user.id) {
                throw new Error("Must be authenticated to post a repo!");
            }

            const newRepo = new Repo({
                url,
                owner: user.id,
            });
            newRepo.save();

            return newRepo;
        },
    },
    Subscription: {

    },
};
