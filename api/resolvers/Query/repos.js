/* server/api/resolvers/Query/repos.js */

import RepoModel from "../../models/Repo.js";


/**
 * Repos query
 */
export default (_, { first, after }) => RepoModel.getPage(first, after);
