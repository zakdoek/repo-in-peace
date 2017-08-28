/* server/api/schema.js */

import { makeExecutableSchema } from "graphql-tools";

import resolvers from "./resolvers/index.js";

const typeDefs = `

scalar DateTime

enum VoteType {
    UPVOTE
    DOWNVOTE
}

type Repo {                 # Repo Model
    id: ID!                 # Repo ID
    url: String!            # Repo url
    name: String!           # Name of the repo
    owner: User!            # Creating user
    upvotesCount: Int!      # Upvoted by
    downvotesCount: Int!    # Downvoted by
    createdAt:  DateTime!   # Time created
    updatedAt:  DateTime!   # Time created
    hasVoted: Boolean!      # If the user has voted
}

type User {                 # User Model
    id: ID!                 # User ID
    username: String!       # Normalized name
}

# A helper to bundle token and user info
type LoginResult {
    id: ID!
    username: String!
    token: String!
}

type Vote {
    id: ID!
    value: VoteType!
    user: User!
    repo: Repo!
}

input VoteInput {
    repoId: ID!
    value: VoteType!
}

type Query {
    repos: [Repo!]!         # List of all repos
    viewer: User            # The current user
}

type Mutation {
    # Add a repo, user id comes from token
    addRepo(url: String!): Repo
    # Vote (insert or update)
    vote(vote: VoteInput!): Vote
    # Clear own vote for value TODO
    # clearVote(repoId: ID!): Repo
    # Create/Login user, return token
    login(ghToken: String!): LoginResult
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
