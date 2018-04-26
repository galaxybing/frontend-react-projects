#!/bin/bash
# start.sh
# 
# http://hospital.dev.317hu.com/hospital-admin/
# http://admin.dev.317hu.com/bz-admin/
#

echo "----------------------------------"  
echo "please select your execute env:" 
select input in dev  sit uat Exit;  
do  
  break  
done  

echo "You have selected $input"
sleep 1;
if [ "$input" = "Exit" ];then
  exit;
else
  echo "run start at $input..." 
fi

./node_modules/.bin/cross-env VERSION_ENV="$input" RUN_ENV=start node build/dev-server.js
# env
# export VERSION_ENV=dev-local
