#!/bin/sh
REDIS_PASSWORD=$(cat $1)
exec redis-server --requirepass $REDIS_PASSWORD