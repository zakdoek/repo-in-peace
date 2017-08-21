/* server/api/schema.js */

import { makeExecutableSchema } from "graphql-tools";

import resolvers from "./resolvers/index.js";

const typeDefs = `
type Repo {
    id: ID!
    url: String!
}

type Query {
    repos: [Repo]
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
