#!/bin/sh
# Start the container

# check streaming ports might be due to tcp protocol
# fileoutput to deepdream folder. test output write to arbit folder

# do mode: debug or start
docker run -it -d -p 80:80 -p 4040:4040 -p 7474:7474 --name aiva-run -v `pwd`:/opt/aiva kengz/aiva

# docker run --publish=7474:7474 --publish=7687:7687 --volume=$HOME/neo4j/data:/data neo4j:3.0
# VBoxManage controlvm boot2docker-vm natpf1 "integralist-sinatra,tcp,127.0.0.1,49161,,4567"
# 
# ok new solution: use nginx on top of all