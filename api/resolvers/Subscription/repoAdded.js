/* api/resolvers/Subscription/repoAdded.js */

import { withFilter } from "graphql-subscriptions";
import UserModel from "../../models/Repo.js";
import { pubsub } from "../index.js";

export const REPO_ADDED = "onRepoAddedSubscription";


export default {
    resolve: payload => UserModel.findById(payload).populate("owner"),
    subscribe: withFilter(
        () => pubsub.asyncIterator(REPO_ADDED),
        payload => !!payload,
    ),
};
