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

# Setup dev environment
export PORT=3000
export STATIC_URL="/static"
