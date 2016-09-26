#!/bin/bash

# copy keys file if not already exist
CONFIG_DIR=`pwd`/config
EXAMPLE_CONFIG="$CONFIG_DIR/example-default.json"
DEV_CONFIG="$CONFIG_DIR/default.json"
PROD_CONFIG="$CONFIG_DIR/production.json"

if [ ! -e "$PROD_CONFIG" ]; then
  cp $EXAMPLE_CONFIG $PROD_CONFIG
  echo "[ --- Created $PROD_CONFIG --- ]\n"
fi

if [ ! -e "$PROD_CONFIG" ]; then
  cp $EXAMPLE_CONFIG $PROD_CONFIG
  echo "[ --- Created $PROD_CONFIG --- ]\n"
fi
