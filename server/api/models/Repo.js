/* server/api/models/Repo.js */

import mongoose, { Schema } from "mongoose";


/**
 * The vote schema
 */
const VoteSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    value: { type: String, enum: ["UPVOTE", "DOWNVOTE"] },
}, { timestamps: true });


/**
 * The Repo model
 */
const RepoSchema = new Schema({
    _id: Schema.Types.ObjectId,
    url: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    votes: [VoteSchema],
}, { timestamps: true });


export default mongoose.model("Repo", RepoSchema, "repos");
