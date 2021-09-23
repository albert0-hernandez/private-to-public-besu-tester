#!/bin/bash
DOCKER_COMPOSE_FILE_PARTICIPANTS="-f config/peers/validator/docker-compose.yaml -f config/peers/node0/docker-compose.yaml -f config/peers/node1/docker-compose.yaml"
docker-compose -f config/docker-compose-entry.yaml $DOCKER_COMPOSE_FILE_PARTICIPANTS --project-name=afb down -v