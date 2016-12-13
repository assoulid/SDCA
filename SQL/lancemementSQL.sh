#! /bin/bash

sudo apt-get install mysql-server mysql-client

mysql -h localhost -u root -proot < requetes.txt
