#!/bin/sh
# stop and cleanup the container

docker stop aiva-run
docker rm aiva-run
docker stop aiva-enter
docker rm aiva-enter