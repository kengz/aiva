#!/bin/sh
# Start the container

echo "[Start container aiva-run, detached]"
docker run -it -d -p 80:80 -p 4040:4041 -p 7474:7475 --name aiva-run -v `pwd`:/opt/aiva kengz/aiva
