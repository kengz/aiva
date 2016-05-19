#!/bin/sh
# Run the container

# todo:
# move python socket dep to Dockerfile
# try run without -d again
# ahh make one that reconnects and rerun npm run debug, instead of starting all over from scratch install
# also non-persistent installation when doing 'enter'

docker run --name aiva-run -v `pwd`:/opt/aiva -it -P kengz/aiva /bin/bash -c "cd /opt/aiva && npm run gi && npm run debug"
# docker run --name aiva-run -v `pwd`:/opt/aiva -d -it -P kengz/aiva tail -f /dev/null
# docker run --name deepdream-json --volumes-from aiva-run -d ubuntu:14.04 /bin/bash -c "cd /opt/deepdream && ./make_json.sh"

