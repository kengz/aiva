#!/bin/sh
# enter the container with a new bash session

container="${1:-aiva-production}"

if [[ "$(docker images -qa kengz/aiva:latest 2> /dev/null)" != "" ]]; then
  echo "[Docker container $container exists; entering with a new bash session]"
  echo "\n[ ******** Use Ctrl-p-q to detach bash session ******** ]\n"

  docker start $container && docker exec -it $container /bin/bash

else
  echo "[Docker container $container not found; start it first]"
fi
