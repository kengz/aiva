#!/bin/sh
# A simple docker script to enter the container

if [ "`docker ps | grep aiva-run`" = "" ]; then
    echo "[Making volume]"
    docker run -it -p 80:80 -p 4040:4041 -p 7474:7475 --rm --name aiva-enter -v `pwd`:/opt/aiva kengz/aiva /bin/bash
else
    echo "[Attaching to container aiva-run, use Ctrl-p-q to detach]"
    docker attach aiva-run
fi
