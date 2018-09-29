#!/bin/bash
# build.sh
#
# chmod +x  build/*.sh
# fe-pub.317hu.com  resources.317hu.com
# 
Pub=$1
echo "----------------------------------"
update_node_modules_status=1

if [ ! "$Pub" = "local" ];then
  echo -e "please enter your will build env version, \n split with one space (eg, dev sit uat v*.*.*):" 
  read env_list

  sleep 1
  
  echo "Whether the node_modules dir will updating or not ?" 
  echo "(0) Y"
  echo "(1) N"
  read update_node_modules
  case $update_node_modules in  
    0|Y|y)
    update_node_modules_dir=", server npm install "
    update_node_modules_status=0
    sleep 1;;
    1|N|n)
    sleep 1;;
    *)
    exit;;
  esac
  
  echo "please enter message for commit:" 
  read commit_msg

  echo -e "\nYou will publish env version: $env_list $update_node_modules_dir, commit message: $commit_msg ?"

  echo "(0) Y"
  echo "(1) N"
  echo "(2) Exit"
  read comfirm_build
  case $comfirm_build in  
    0|Y|y)
    echo "run build at $env_list..."
    sleep 1;;
    1|N|n)
    echo "it will abort..."
    sleep 1
    exit;;
    *)
    exit;;
  esac
 
  checked_git_status
else
  ./node_modules/.bin/cross-env VERSION_ENV="$Pub" RUN_ENV="$Pub" node build/build.js "$Pub"
  echo -e "...本地构建成功"
fi
