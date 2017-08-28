/* server/api/resolvers/index.js */

import addRepo from "./Mutation/addRepo.js";
import login from "./Mutation/login.js";
import repos from "./Query/repos.js";
import viewer from "./Query/viewer.js";
import User from "./User.js";

export default {
    User,
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
