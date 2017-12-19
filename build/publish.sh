#!/bin/bash
# build.sh
#
# chmod +x  build/*.sh
# http://resources.317hu.com/frontend-react-projects/v2.0.3/static/assets/css/lib-app.css
# 
Pub=$1
echo "----------------------------------"
echo "please verify you have dir pub:" 
echo "(0) Y"  
echo "(1) N"
read comfirm_pub
case $comfirm_pub in  
  0|Y|y)
  echo "run pub..."
  sleep 1;;
  1|N|n)
  echo "it will abort..."
  sleep 1
  exit;;
  *)
  exit;;
esac

echo "please select your build env:" 
select input in dev sit uat prod Exit;  
do  
  break  
done  

sleep 1;
if [ "$input" = "Exit" ];then
  exit;
elif [ "$input" = "prod" ];then
  echo "You have selected $input"
  echo "please enter your will build version (eg, v*.*.*):" 
  read branch_name
else
  echo "You have selected $input"
  echo "please enter your will build branch name:" 
  read branch_name
fi

echo "please enter message for commit:" 
read commit_msg

if [ "$input" = "prod" ];then
  echo -e "\nYou will publish version: $branch_name , commit message: $commit_msg ?"
else
  echo -e "\nYou has branch name: $branch_name , commit message: $commit_msg ?"
fi

echo "(0) Y"  
echo "(1) N"
echo "(2) Exit"
read comfirm_build
case $comfirm_build in  
  0|Y|y)
  echo "run build at $input..."
  sleep 1;;
  1|N|n)
  echo "it will abort..."
  sleep 1
  exit;;
  *)
  exit;;
esac

if [ "$Pub" = "publish" ];then
  echo "no build..."
else
  if [ "$input" = "prod" ];then
    ./node_modules/.bin/cross-env VERSION_ENV="$branch_name" node build/build.js "$branch_name"
  else
    ./node_modules/.bin/cross-env VERSION_ENV="$input" node build/build.js "$branch_name"
  fi
fi


# 处理发布目录
cd pub
checked_git_dir () {
  local dir=. origin
  if [ ! -d "$dir/.git" ]; then
    origin=$(git remote -v | grep origin | head -1 | awk '{print $2}')
    git init
    git remote add origin $origin
  fi
}
checked_git_dir

# if false;then
git add .
if [ "$input" = "prod" ];then
  git commit -m "$branch_name@$commit_msg"
  git push origin "HEAD:$input-$branch_name"
else
  git commit -m "$input@$commit_msg"
  git push -f origin "$branch_name:$input-$branch_name"
fi

cd ../
echo "...构建完成"