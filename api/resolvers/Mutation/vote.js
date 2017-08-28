/* api/resolvers/Mutation/vote.js */

import RepoModel from "../../models/Repo.js";


/**
 * Vote for a repo
 */
export default function vote(_, { vote: { repoId, value } }, { user }) {
    if (!user || !user.profile) {
        throw new Error("Must be logged in to vote!");
    }


    return RepoModel.findById(repoId)
        .then(repoDoc => ({
            voteItem: repoDoc.vote(user.profile.id, value),
            repoDoc,
        }))
        .then(({ voteItem, repoDoc }) => {
            const result = {
                id: voteItem._id,
                value,
                repo: repoId,
                user: user.profile.id,
            };

            repoDoc.votes.addToSet(voteItem);
            return repoDoc.save()
                .then(() => result);
        });
}
