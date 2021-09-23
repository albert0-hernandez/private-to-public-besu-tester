#!/bin/bash

function node_healthcheck {
    curl -s -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":53}' http://127.0.0.1:22001 > /dev/null
    while [ 0 -ne $? ]
    do
        echo "Waiting 10 seconds for node to be up to create privacy groups..."
        sleep 10
        curl -s -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":53}' http://127.0.0.1:22001 > /dev/null
    done
}

DOCKER_COMPOSE_FILE_PARTICIPANTS="-f config/peers/validator/docker-compose.yaml -f config/peers/node0/docker-compose.yaml -f config/peers/node1/docker-compose.yaml"
docker-compose -f config/docker-compose-entry.yaml $DOCKER_COMPOSE_FILE_PARTICIPANTS --project-name=afb up -d

node_healthcheck
cd scripts/setup-privacy-groups
npm install
node index.js
cd ../../
