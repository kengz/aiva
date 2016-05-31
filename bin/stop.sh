#!/bin/sh
# stop the container

if [[ $1 && $1=='production' ]]; then
  container=aiva-production
else
  container=aiva-development
fi

# if using docker
if [[ "$(docker images -q kengz/aiva:latest 2> /dev/null)" != "" ]]; then
  echo '[ ------------- Stopping Docker container ------------- ]'

  if [[ "$(docker ps -qa --filter name=$container 2> /dev/null)" != "" ]]; then
    echo "[ -------------- Stop '$container' -------------- ]\n"
    docker stop $container
  fi

else # not using Docker
  echo "[ ------- Stopping on local machine, not Docker ------- ]"
  npm run _stop
fi;
