#!/bin/sh

echo "Create your configuration for mysql"

read -p "Give your root user : " user
read -p "Give a password for silo user : " silo_password
sed -e "s/admin_password/$silo_password/g" preinstall.sql > tmp_preinstall.sql && mv -f tmp_preinstall.sql preinstall.sql
mysql -u$user -p < preinstall.sql
sed -e "s/$silo_password/admin_password/g" preinstall.sql > tmp_preinstall.sql && mv -f tmp_preinstall.sql preinstall.sql

cp mysql_conf_default.json ./mysql_conf.json
sed -e "s/user_password/$silo_password/g" mysql_conf.json > tmp_mysql_conf.json && mv -f tmp_mysql_conf.json mysql_conf.json
port=`egrep port[[:space:]]+=[[:space:]]+[0-9]{4} /etc/mysql/my.cnf | cut -d= -f2 | cut -d ' ' -f2 | head -1`
sed -e "s/port_number/$port/g" mysql_conf.json > tmp_mysql_conf.json && mv -f tmp_mysql_conf.json mysql_conf.json
