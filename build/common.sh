#!/bin/bash
# common.sh
#

function checked_git_dir () {
  local dir=. origin
  if [ ! -d "$dir/.git" ]; then
    origin=$(git remote -v | grep origin | head -1 | awk '{print $2}')
    git init
    git remote add origin $origin
  fi
}
export -f checked_git_dir

function checked_git_status () {
  local dir=. msg branch_name commit_msg_status
  if [ -d "$dir/.git" ]; then
    msg=$(git status | grep 'Changes not staged for commit' | awk '{print $3}')
    branch_name=$(git branch -v | grep '*' | awk '{print $2}')
    # echo -e "$env_list"
    if [ "$msg" = 'staged' ]; then
      commit_msg_status="...请暂存本地修改？"
    else
      # 统一发布
      if [ -d "tmp" ];then
        rm -rf tmp
      fi
      mkdir -m 776 tmp
      git clone ./ ./tmp
      rm -rf tmp/.git

      if [ ! -d "pub" ];then
        mkdir -m 776 pub
      fi
      cd ./pub
      checked_git_dir

      cp -a ../tmp/. .
      rm -rf ../tmp
      cur_dateTime=$(date "+%Y%m%d%H%M%s")
      # echo -n "$cur_dateTime"
      # touch "pub-*"
      FILE="pub.json"
      echo -e "{" > $FILE
      echo -e "\t\"branchEnv\":\"$branch_name\"," >> $FILE
      echo -e "\t\"tamp\":\"$cur_dateTime\"" >> $FILE
      echo -e "}" >> $FILE

      git add .
      git commit -m "$env_list@$commit_msg_action $commit_msg"
      git push -f origin "HEAD:pub-$branch_name"
      commit_msg_status="...构建完成，请查看钉钉消息。"
    fi
    echo -e "$commit_msg_status"
  fi
}
export -f checked_git_status

exec ./build/build.sh
