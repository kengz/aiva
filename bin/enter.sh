#!/bin/bash
# enter the container with a new bash session, separate from the supervisord session
# If you wanna run supervisord, use start.sh

if [[ $1 && $1=='production' ]]; then
  container=aiva-production
else
  container=aiva-development
fi

if [[ "$(docker images -qa kengz/aiva:latest 2> /dev/null)" != "" ]]; then
  if [[ "$(docker ps -qa --filter name=$container 2> /dev/null)" != "" ]]; then

    if [[ $1 && $1=='production' ]]; then
      echo "[ Production: Docker container '$container' exists; enter with new bash session ]"
    else
      echo "[ Development: Docker container '$container' exists; enter with new bash session ]"
    fi
    echo "[ -------- Use Ctrl-p-q to detach bash session -------- ]\n"

    docker start $container && docker exec -it $container /bin/bash
  else
    echo "[ Docker container '$container' does not exist. Start it first. ]"
  fi

else
  echo "[Docker container $container not found; start it first]"
fi
