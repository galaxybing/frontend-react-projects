#!/bin/bash
# build.sh
#
# chmod +x  build/*.sh

echo "----------------------------------"  
echo "please select your build env:" 
select input in dev  sit uat prod Exit;  
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
echo -e "You has branch name: \c $branch_name"

echo "run build at $input..." 

./node_modules/.bin/cross-env VERSION_ENV="$input" node build/build.js "$branch_name"
# env
echo "please enter message for commit:" 
read commit_msg
git add .
git commit -m "$input@$commit_msg"
git push -f origin "$branch_name:$input-$branch_name"
