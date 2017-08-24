/* server/api/schema.js */

import { makeExecutableSchema } from "graphql-tools";

import resolvers from "./resolvers/index.js";

const typeDefs = `
enum VoteType {
    UPVOTE
    DOWNVOTE
}

type Repo {
    id: ID!                 # Repo ID
    url: String!            # Repo url
    name: String            # Name of the repo, optional until fetch from github
                            # api
    owner: User!            # Creating user
    upvotes: [Vote!]        # Upvoted by
    downvotes: [Vote!]      # Downvoted by
    createdAt:  Int!        # Time created
    updatedAt:  Int!        # Time created
}

type User {
    id: ID!                 # User ID
    name: String!           # User name
    username: String!       # Normalized name
    repos: [Repo!]          # Repositories owned by self
    upvoted: [Vote!]        # Upvoted repos
    downvoted: [Vote!]      # Downvoted repos
}

# A helper to bundle token and user info
type UserLogin {
    user: User!
    token: String!
}

# Will be embedded into the repo object
type Vote {
    id: ID!                 # Id (not neccesary, revisit)
    user: User!             # User that created the vote
    value: VoteType!        # The value of this vote
    createdAt: Int!         # Created timestamp
    updatedAt: Int!         # Last updated timestamp
}

input VoteInput {
    repoId: ID!
    value: VoteType!
}

type Query {
    repos: [Repo!]!         # List of all repos
}

type Mutation {
    # Add a repo, user id comes from token
    addRepo(url: String!): Repo
    # Vote (insert or update)
    vote(vote: VoteInput!): Vote
    # Clear own vote for value
    clearVote(repoId: ID!): Repo
    # Create/Login user, return token
    login(name: String!): UserLogin
    # login(ghOAuthToken: String!): UserLogin
}

type Subscription {
    # Notify when added
    repoAdded: Repo
    # Repo updated, (i.e name fetched from the github)
    repoUpdated(repoId: ID!): Repo
    # Notify when a vote is changed on selected repo
    votesChanged(repoId: ID!): Vote
    # Notify when votes on a repo owned by user is changed
    ownedChanged: Vote
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
