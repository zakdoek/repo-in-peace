/* server/api/resolvers/index.js */

import addRepo from "./Mutation/addRepo.js";
import login from "./Mutation/login.js";
import repos from "./Query/repos.js";
import User from "./User.js";

export default {
    User,
    Query: {
        repos,
    },
    Mutation: {
        addRepo,
        login,
    },
    Subscription: {},
};
