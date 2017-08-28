/* server/api/resolvers/index.js */

import { GraphQLDateTime as DateTime } from "graphql-iso-date";

import Repo from "./Repo.js";
import addRepo from "./Mutation/addRepo.js";
import login from "./Mutation/login.js";
import repos from "./Query/repos.js";
import viewer from "./Query/viewer.js";

export default {
    DateTime,
    Repo,
    Query: {
        repos,
        viewer,
    },
    Mutation: {
        addRepo,
        login,
    },
    Subscription: {},
};
