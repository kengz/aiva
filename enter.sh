#!/bin/sh
# A simple docker script to enter into the container

if [ "`docker ps | grep aiva-run`" = "" ]; then
    echo "Making volume"
    docker run -it -P --rm --name aiva-enter -v `pwd`:/opt/aiva kengz/aiva /bin/bash
else
    echo "Steaming volume from aiva-run"
    docker run -it -P --rm --name aiva-enter --volumes-from=aiva-run kengz/aiva /bin/bash
fi
