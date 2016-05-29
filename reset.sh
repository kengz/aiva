#!/bin/sh
# remove all the containers

echo '[Removing Docker container for clean reset]'
if [[ "$(docker ps -qa --filter name=aiva-production 2> /dev/null)" != "" ]]; then
  docker stop aiva-production
  docker rm aiva-production
fi

if [[ "$(docker ps -qa --filter name=aiva-development 2> /dev/null)" != "" ]]; then
  docker stop aiva-development
  docker rm aiva-development
fi

if [[ "$(docker ps -qa --filter name=aiva-enter 2> /dev/null)" != "" ]]; then
  docker stop aiva-enter
  docker rm aiva-enter
fi