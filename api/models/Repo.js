/* server/api/models/Repo.js */

import mongoose, { Schema, Model } from "mongoose";


/**
 * The vote schema
 */
const VoteSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    value: { type: String, enum: ["UPVOTE", "DOWNVOTE"] },
}, { timestamps: true });


/**
 * The Repo model
 */
const RepoSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    url: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    votes: [VoteSchema],
}, { timestamps: true });


/**
 * Repo model
 */
class Repo extends Model {
    /**
     * Get a page of repos
     */
    static async getPage(first, after) {

        let query = this.find().sort("-createdAt");

        if (after) {
            const afterDoc = await this.findOne({ _id: after });
            query = query.where("createdAt").lt(afterDoc.createdAt);
        }

        if (first) {
            query = query.limit(first + 1);
        }

        return query.populate("owner").then(repos => {
            const page = {
                hasNextPage: repos.length === first + 1,
            };

            if (page.hasNextPage) {
                page.nodes = repos.slice(0, -1);
                page.cursor = page.nodes[page.nodes.length - 1].id;
            } else {
                page.nodes = repos;
                page.cursor = null;
            }

            return page;
        });
    }

    /**
     * Repo name getter
     */
    get name() {
        return this.url.split("/").pop();
    }

    /**
     * Count the vote types
     */
    _countVotesOfType(voteType) {
        return this.votes.reduce((accumulator, current) => {
            if (current.value === voteType) {
                return ++accumulator;
            }

            return accumulator;
        }, 0);
    }

    /**
     * Get the number of upvotes
     */
    get upvotesCount() {
        return this._countVotesOfType("UPVOTE");
    }

    /**
     * Get the number of downvotes
     */
    get downvotesCount() {
        return this._countVotesOfType("DOWNVOTE");
    }

    /**
     * Test if a user has voted on this repo
     */
    hasVoted(userId) {
        return !!this.votes.find(vote => userId === String(vote.user));
    }

    /**
     * Vote
     */
    vote(userId, value) {
        if (this.hasVoted(userId)) {
            throw new Error("Already voted");
        }

        return this.votes.create({ user: userId, value });
    }
}


export default mongoose.model(Repo, RepoSchema, "repos");
