FROM ubuntu:16.04
MAINTAINER Wah Loon Keng <kengzwl@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Get latest Node 6 install script and save it to /tmp
ADD https://raw.githubusercontent.com/nodesource/distributions/master/deb/setup_6.x /tmp/node6_setup.sh

# Run node installer script to prepare apt-get for later install
RUN cat /tmp/node6_setup.sh | bash \
    &&  apt-get update \
    && apt-get install -y build-essential \
    dialog \
    git \
    net-tools \
    nodejs \
    nginx \
    postgresql \
    postgresql-contrib \
    python3-dev \
    python3-pip \
    python3-setuptools \
    software-properties-common \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Replace the default Nginx configuration file
# RUN rm -v /etc/nginx/nginx.conf
COPY config/nginx.conf /etc/nginx/

# Add a supervisor configuration file
COPY config/supervisord.conf /etc/supervisor/conf.d/

# Define mountable directories
VOLUME ["/var/log"]

# Define working directory
RUN mkdir -p /var/www/aiva

WORKDIR /var/www/aiva
COPY package.json ./
COPY . ./
RUN sed -i s/peer/trust/ /etc/postgresql/9.5/main/pg_hba.conf && /etc/init.d/postgresql restart
RUN ["/bin/bash", "-c", "npm i && npm run setup"]

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
