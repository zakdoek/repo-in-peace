/* server/api/resolvers/Mutation/addRepo.js */

import gql from "graphql-tag";

import getGitHubClient from "../../../lib/utils/getGitHubClient.js";

import RepoModel from "../../models/Repo.js";


const CHECK_URL = gql`
query CheckGithubUrl($owner: String!, $name: String!) {
  repository(name: $name, owner: $owner) {
    id
  }
}
`;


/**
 * addRepo resolver
 */
export default function addRepo(_, { url }, { user }) {
    if (!user || !user.profile) {
        throw new Error("Must be authenticated to post a repo!");
    }

    url = url.endsWith("/") ? url.slice(0, -1) : url;

    return RepoModel.findOne({ url: url }).then(repoDoc => {
        if (repoDoc) {
            throw new Error("Repo already present.");
        }

        // Check if repo is valid
        const [owner, name] = url.split("/").slice(-2);
        if (!owner || !name) {
            throw new Error("Invalid url");
        }

        const ghClient = getGitHubClient(user.profile.token);
        if (!ghClient) {
            throw new Error("Login failed");
        }

        // Check if repo exist on GH
        return ghClient.query({
            query: CHECK_URL,
            variables: {
                owner,
                name,
            },
        }).then(() => {
            const newRepo = new RepoModel({
                url,
                owner: user.profile.id,
            });
            return newRepo.save().then(repoDoc => repoDoc);
        });
    });
}
