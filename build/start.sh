#!/bin/bash
# start.sh
#

echo "----------------------------------"  
echo "please select your execute env:" 
select input in dev  sit uat prd Exit;  
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

./node_modules/.bin/cross-env VERSION_ENV="$input-local" RUN_ENV=start node build/dev-server.js
# env
# export VERSION_ENV=dev-local
