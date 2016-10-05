FROM ubuntu:16.04
MAINTAINER Wah Loon Keng <kengzwl@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# General dependencies
RUN apt-get update
RUN apt-get install -y git nano curl wget software-properties-common build-essential
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y python3-dev python3-pip python3-setuptools
RUN apt-get install -y mysql-server

# Install Nginx, supervisor, monitoring tools
RUN apt-get install -y nginx supervisor dialog net-tools
# Replace the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf
ADD config/nginx.conf /etc/nginx/
# Add a supervisor configuration file
ADD config/supervisord.conf /etc/supervisor/conf.d/

# Define mountable directories
VOLUME ["/var/log"]

# Define working directory
RUN mkdir -p /var/www/aiva
WORKDIR /var/www/aiva

ADD package.json ./
RUN npm i
ADD . /var/www/aiva
RUN npm run setup

# expose ports for prod/dev, see config/
# the ports on the left of each is the surrogate port for nginx redirection
EXPOSE 4039 4040 4038 4041 7472 7474 7475 7476 6463 6464 6465 6466

# default command on creating a new container
# CMD service mysql start && NPM_RUN="development" supervisord

# useful Docker commands
# build: docker build -t kengz/aiva .
# run: docker run -it -P --rm --name aiva-build kengz/aiva /bin/bash
# post-build: docker commit -m "base ubuntu 16.04 node python" -a "kengz" <id while a container persists> kengz/aiva:v0
# check: docker images
# push: docker push kengz/aiva
# to remove unused images: docker rmi -f $(docker images | grep "^<none>" | awk '{print $3}')
# to remove all containers: docker rm `docker ps -aq`
