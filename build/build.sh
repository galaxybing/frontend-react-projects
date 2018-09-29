#!/bin/bash
# build.sh
#
# chmod +x  build/*.sh
# fe-pub.317hu.com  resources.317hu.com
# 
Pub=$1
echo "----------------------------------"

# 处理发布目录
checked_git_dir () {
  local dir=. origin
  if [ ! -d "$dir/.git" ]; then
    origin=$(git remote -v | grep origin | head -1 | awk '{print $2}')
    git init
    git remote add origin $origin
  fi
}

checked_git_status () {
  local dir=. msg branch_name commit_msg_status
  if [ -d "$dir/.git" ]; then
    msg=$(git status | grep 'Changes not staged for commit' | awk '{print $3}')
    branch_name=$(git branch -v | grep '*' | awk '{print $2}')
    # echo -e "$env_list"
    if [ "$msg" = 'staged' ]; then
      commit_msg_status="...请暂存本地修改？" # 因为，当前为发布服务器源码构建；所以需要本地源码必需暂存
    else
      # 统一发布
      if [ -d "tmp" ];then
        rm -rf tmp
      fi
      mkdir -m 7777 tmp
      git clone ./ ./tmp
      rm -rf tmp/.git

      if [ ! -d "pub" ];then
        mkdir -m 7777 pub
      fi
      cd ./pub
      checked_git_dir

      cp -a ../tmp/* .
      rm -rf ../tmp
      git add .
      git commit -m "$branch_name@$commit_msg@$env_list"
      git push -f origin "HEAD:pub-$branch_name"
      commit_msg_status="...构建完成。"
    fi
    echo -e "$commit_msg_status"
  fi
}

if [ ! "$Pub" = "local" ];then
  echo -e "please enter your will build env version, \n split with one space (eg, dev sit uat v*.*.*):" 
  read env_list

  sleep 1
 
  echo "please enter message for commit:" 
  read commit_msg

  echo -e "\nYou will publish env version: $env_list , commit message: $commit_msg ?"

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
