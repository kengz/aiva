#!/bin/sh
# Start the container

# todo:
# move python socket dep to Dockerfile
# try run without -d again
# ahh make one that reconnects and rerun npm run debug, instead of starting all over from scratch install
# also non-persistent installation when doing 'enter'

docker run -it -d -P --name aiva-run -v `pwd`:/opt/aiva kengz/aiva /bin/bash -c "cd /opt/aiva && npm run gi && npm run debug"
