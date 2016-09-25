#!/bin/bash
# Start aiva, use and start Docker container if exists
# this bash session is for use with supervisord. For new bash sessions to the same container, use enter.sh


# copy keys file if not already exist
AIVA_DIR=`pwd`
BIN_DIR="$AIVA_DIR/bin"

env_count=$(find $AIVA_DIR -name ".env*" -maxdepth 1 -type f | wc -l)
example_env_count=$(find $AIVA_DIR -name ".env-example" -maxdepth 1 -type f | wc -l)
if [[ $env_count -eq 1 && $example_env_count -eq 1 ]]; then (
  cp $AIVA_DIR/.env-example $AIVA_DIR/.env
  echo "Created .env"
  );
  else (
  echo "Not creating .env since it already exists"
  )
fi

keys_count=$(find $BIN_DIR -name ".keys-*" -maxdepth 1 -type f | wc -l)
example_keys_count=$(find $BIN_DIR -name ".keys-example" -maxdepth 1 -type f | wc -l)
if [[ $keys_count -eq 1 && $example_keys_count -eq 1 ]]; then (
  cp $BIN_DIR/.keys-example $BIN_DIR/.keys-aiva
  cp $BIN_DIR/.keys-example $BIN_DIR/.keys-aivadev
  echo "Created bin/.keys-aiva, bin/.keys-aivadev"
  );
  else (
  echo "Not creating bin/.keys-aiva, bin/.keys-aivadev since keys already exist"
  )
fi

# set from .env
eval "$(cat .env | sed 's/^/export /')"

if [[ $CLOUDDREAM_PATH && -d ${HOME}/clouddream ]]; then
  echo "Using AIVA with Deepdream: make sure you start ${HOME}/clouddream"
  CLOUDDREAM_LINK_VOL="-v ${HOME}/clouddream:${CLOUDDREAM_PATH}"
else
  CLOUDDREAM_LINK_VOL=""
fi

if [[ $1 && $1=='production' ]]; then
  container=aiva-production
  COMMAND="docker run -m 4G -it -d -p 4040:4039 -p 7474:7472 -p 6464:6463 --name $container $CLOUDDREAM_LINK_VOL -v `pwd`:/opt/aiva kengz/aiva /bin/bash -c 'NPM_RUN=\"production\" supervisord'"
else
  container=aiva-development
  COMMAND="docker run -m 4G -it -p 4041:4038 -p 7476:7475 -p 6466:6465 --name $container $CLOUDDREAM_LINK_VOL -v `pwd`:/opt/aiva kengz/aiva /bin/bash -c 'NPM_RUN=\"development\" $SHELL'"
fi

if [[ "$(docker images -q kengz/aiva:latest 2> /dev/null)" != "" ]]; then
  # Set host-to-Docker port forwarding on OSX
  # To add new ports: 
  # - EXPOSE a surrogate-actual pair of ports in Dockerfile, 
  # - Add the pair in bin/nginx.conf to expose to localhost
  # - then add the actual port in the list below (for VM port-forwarding)
  # - then publish in the docker run cmd below `-p HOST_PORT:CONTAINER_NGINX_PORT
  if [[ $(uname) == "Darwin" ]]; then
    for i in {4040,4041,7474,7476,6464,6466}; do (VBoxManage controlvm "default" natpf1 "tcp-port$i,tcp,,$i,,$i" > /dev/null 2>&1 &); done
  fi

  echo "[ ----- Docker image kengz/aiva pulled, using it ------ ]"
  echo "[ -------- Use Ctrl-p-q to detach bash session -------- ]\n"

  if [[ "$(docker ps -qa --filter name=$container 2> /dev/null)" != "" ]]; then
    echo "[ --- Docker container '$container' exists; attaching to it --- ]"
    if [[ $1 && $1=='production' ]]; then
      echo "[ ------ To attach, run again: start production ------- ]\n"
    else
      echo "[ ---------------- To run: supervisord ---------------- ]\n"
    fi
    docker start $container && docker attach $container

  else
    if [[ $1 && $1=='production' ]]; then
      echo "[ Production: Creating new Docker container '$container' ]"
      echo "[ ------ To attach, run again: start production ------- ]\n"
      eval ${COMMAND}
    else
      echo "[ Development: Creating new Docker container '$container' ]"
      echo "[ ---------------- To run: supervisord ---------------- ]\n"
      eval ${COMMAND}
    fi
  fi

else # not using Docker
  echo "[ ------- Starting on local machine, not Docker ------- ]"
  if [[ $1 && $1=='production' ]]; then
    npm run production
  else
    npm run development
  fi
fi;
