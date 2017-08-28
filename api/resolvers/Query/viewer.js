/* server/api/resolvers/Query/viewer.js */

import UserModel from "../../models/User.js";


/**
 * Viewer
 */
export default (_, __, { user }) => {
    if (user && user.profile) {
        return UserModel.findOne({
            username: user.profile.username,
        }).then(userDoc => userDoc);
    }

    return null;
};
