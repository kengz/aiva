#!/bin/sh
# Start the container

# check streaming ports might be due to tcp protocol
# fileoutput to deepdream folder. test output write to arbit folder

# do mode: debug or start
docker run -p 4040:4040 -p 7474:7474 --rm --name aiva-run -v `pwd`:/opt/aiva kengz/aiva /bin/bash -c "cd /opt/aiva && npm run gi && npm run debug"
