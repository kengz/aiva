#!/bin/sh
# Start the container

# check streaming ports might be due to tcp protocol
# fileoutput to deepdream folder. test output write to arbit folder

docker run -it -d -p 80:80 -p 4040:4041 -p 7474:7475 --name aiva-run -v `pwd`:/opt/aiva kengz/aiva
