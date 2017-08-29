/* server/api/resolvers/index.js */

import { GraphQLDateTime as DateTime } from "graphql-iso-date";
import { PubSub } from "graphql-subscriptions";

import Repo from "./Repo.js";
import Vote from "./Vote.js";
import addRepo from "./Mutation/addRepo.js";
import login from "./Mutation/login.js";
import vote from "./Mutation/vote.js";
import repos from "./Query/repos.js";
import viewer from "./Query/viewer.js";
import repoAdded from "./Subscription/repoAdded.js";


export const pubsub = new PubSub();


export default {
    DateTime,
    Repo,
    Vote,
    Query: {
        repos,
        viewer,
    },
    Mutation: {
        addRepo,
        login,
        vote,
    },
    Subscription: {
        repoAdded,
    },
};
