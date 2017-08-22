/* server/api/schema.js */

import { makeExecutableSchema } from "graphql-tools";

import resolvers from "./resolvers/index.js";

const typeDefs = `
enum VoteType {
    UPVOTE
    DOWNVOTE
}

input VoteInput {
    repoId: ID!
    value: VoteType!
}

type Repo {
    id: ID!                 # Repo ID
    url: String!            # Repo url
    owner: User!            # Creating user
    upvoteds: [User!]       # Upvoted by
    downvotes: [User!]      # Downvoted by
    createdAt:  Int!        # Time created
}

type User {
    id: ID!                 # User ID
    name: String!           # User name
    repos: [Repo!]          # Repositories owned by self
    upvoted: [Repo!]        # Upvoted repos
    downvoted: [Repo!]      # Downvoted repos
}

# Will be embedded into the repo object
type Vote {
    id: ID!                 # Id (not neccesary, revisit)
    repo: Repo!             # Repo subject of this vote
    user: User!             # User that created the vote
    createdAt: Int!         # Created timestamp
    updatedAt: Int!         # Last updated timestamp
    value: VoteType!        # The value of this vote
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
}

type Subscription {
    # Notify when added
    repoAdded(): Repo
    # Notify when a vote is changed on selected repo
    votesChanged(repoId: ID!): Vote
    # Notify when votes on a repo owned by user is changed
    ownedChanged(): Vote
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
