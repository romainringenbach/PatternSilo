#!/bin/sh

read -p "Give your root user : " user
read -p "Give a password for silo user : " silo_password

grep password preinstall.sql | sed -e "s/password/$silo_password/g"

mysql -u$user -p < preinstall.sql