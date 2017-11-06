#!/bin/bash
# build.sh
#
# chmod +x  build/*.sh

echo "----------------------------------"  
echo "please select your build env:" 
select input in dev sit uat prod Exit;  
do  
  break  
done  

sleep 1;
if [ "$input" = "Exit" ];then
  exit;
else
  echo "You have selected $input"
fi

echo "please enter your will build branch name:" 
read branch_name

echo "please enter message for commit:" 
read commit_msg
echo -e "You has branch name: $branch_name , commit message: $commit_msg \n"

echo "(0) Y"  
echo "(1) N"
echo "(2) Exit"
read comfirm_build
case $comfirm_build in  
    0)
    echo "run build at $input..."
    sleep 1;;
    1)
    echo "you will abort..."
    sleep 1
    exit;;
    2)
    exit;;
esac

./node_modules/.bin/cross-env VERSION_ENV="$input" node build/build.js "$branch_name"
# env

git add .
git commit -m "$input@$commit_msg"
git push -f origin "$branch_name:$input-$branch_name"
