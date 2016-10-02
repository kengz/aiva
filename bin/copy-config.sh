#!/bin/bash

# copy keys file if not already exist
CONFIG_DIR=`pwd`/config
EXAMPLE_CONFIG="$CONFIG_DIR/example-default.json"
DEV_CONFIG="$CONFIG_DIR/default.json"
PROD_CONFIG="$CONFIG_DIR/production.json"
EXAMPLE_DB_CONFIG="$CONFIG_DIR/example-db.json"
DB_CONFIG="$CONFIG_DIR/db.json"

if [ ! -e "$DEV_CONFIG" ]; then
  cp $EXAMPLE_CONFIG $DEV_CONFIG
  echo "[ --- Created $DEV_CONFIG --- ]"
fi

if [ ! -e "$PROD_CONFIG" ]; then
  cp $EXAMPLE_CONFIG $PROD_CONFIG
  echo "[ --- Created $PROD_CONFIG --- ]"
fi

if [ ! -e "$DB_CONFIG" ]; then
  cp $EXAMPLE_DB_CONFIG $DB_CONFIG
  echo "[ --- Created $DB_CONFIG --- ]"
fi
