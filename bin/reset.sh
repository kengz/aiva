#!/bin/bash
# stop and remove the container for reset

# copy keys file if not already exist
BIN_DIR=`pwd`/bin
$BIN_DIR/copy-config.sh

if [[ $1 && $1=='production' ]]; then
  container=aiva-production
else
  container=aiva-development
fi

echo '[ -------- Stopping & Removing Docker container ------- ]'

if [[ "$(docker ps -qa --filter name=$container 2> /dev/null)" != "" ]]; then
    echo "[ ---------- Stop & remove '$container' --------- ]\n"
    docker stop $container && docker rm $container
fi