#!/bin/sh
# stop the container

if [[ $1 && $1=='production' ]]; then
  container=aiva-production
else
  container=aiva-development
fi

echo '[ ------------- Stopping Docker container ------------- ]'

if [[ "$(docker ps -qa --filter name=$container 2> /dev/null)" != "" ]]; then
    echo "[ -------------- Stop '$container' -------------- ]\n"
    docker stop $container
fi
