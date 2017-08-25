/* server/api/models/User.js */

import mongoose, { Schema } from "mongoose";


/**
 * The User schema
 */
const UserSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    username: String,
}, { timestamps: true });


export default mongoose.model("User", UserSchema, "users");
