/* server/api/resolvers/index.js */

export default {
    Query: {
        repos: () => [
            {
                id: 1,
                url: "URL 1",
            },
            {
                id: 2,
                url: "URL 2",
            }
        ],
    }
};
