#!/bin/sh
export MYSQL_PASSWORD=$(cat $1)
export MYSQL_ROOT_PASSWORD=$(cat $2)
docker-entrypoint.sh mysqld