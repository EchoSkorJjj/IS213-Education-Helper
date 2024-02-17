#!/bin/sh
mysql -u root --password="$MYSQL_ROOT_PASSWORD" -Bse "ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';flush privileges;"