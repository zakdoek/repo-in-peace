# Tools
function getRoot() {
    # TODO: Support other shells
    local DIR="../"
    if [[ "$(basename $SHELL)" == "zsh" ]]; then
        DIR=$(dirname $0:A)
    else
        DIR=$(dirname "${BASH_SOURCE[0]}")
    fi

    echo $DIR
}

# Activate node environment
function activateNode() {
    local ROOT=$(getRoot)

    # Detect node state
    if [[ ! -d "$ROOT/node_modules" ]]; then
        echo "No node enviroment found, installing"
        (cd $ROOT && yarn install)
    fi

    # Activate local node
    export PATH=$(yarn bin):$PATH
}

# Select the node environment
nvm use

# Activate local node
activateNode

# Set bin dir for tooling
export PATH=$(getRoot)/bin:$PATH

# Front server envs
export PORT=3000
export STATIC_URL="/static"
export FRONT_URL="http://localhost:$PORT"
export GITHUB_CLIENT_ID="$REPO_IN_PEACE_GH_ID"
export GITHUB_CLIENT_SECRET="$REPO_IN_PEACE_GH_SECRET"
export SESSION_SECRET="secret"

# Api server envs
export API_PORT=4000
export API_URL="http://localhost:$API_PORT/graphql"
export API_WS_URL="ws://localhost:$API_PORT/subscriptions"
export API_MONGO_URL="mongodb://127.0.0.1:${$(docker-compose port mongo 27017)##*:}/db"
export API_JWT_SECRET="secret"
export API_CORS_WHITELIST="*"
