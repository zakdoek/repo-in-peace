/* server/api/resolvers/Mutation/login.js */

import slugify from "speakingurl";

import UserModel from "../../models/User.js";


/**
 * Login mutation
 */
export default function login(_, { name }) {
    return UserModel.findOne({
        username: slugify(name, ""),
    }).then(userDoc => {
        if (userDoc) {
            // User is found, return data and token
            return {
                user: userDoc,
                token: userDoc.token,
            };
        }

        // Create a user and return
        return new UserModel({ name }).save().then(userDoc => {
            return {
                user: userDoc,
                token: userDoc.token,
            };
        });
    });
}