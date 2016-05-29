#!/bin/sh
# enter the container with a new bash session

if [[ $1 && $1=='production' ]]; then
  container=aiva-production
else
  container=aiva-development
fi

if [[ "$(docker images -qa kengz/aiva:latest 2> /dev/null)" != "" ]]; then
    if [[ $1 && $1=='production' ]]; then
      echo "[Production: Docker container '$container' exists; entering with new bash session]"
    else
      echo "[Development: Docker container '$container' exists; entering with new bash session]"
    fi
  echo "\n[ ******** Use Ctrl-p-q to detach bash session ******** ]\n"

  docker start $container && docker exec -it $container /bin/bash

else
  echo "[Docker container $container not found; start it first]"
fi
