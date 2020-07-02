#!/bin/bash

VERSION=2.0.7

DEFAULT_SCRIPT=dev:weapp

# 检测taro版本未匹配或未安装 执行安装命令
if [ $1 ] 
  then 
    script=$1
  else 
    script=$DEFAULT_SCRIPT
fi

taroVersion=$(taro -V)

if [[ $taroVersion =~ $VERSION ]]
  then  
    npm run $script
  else
    echo 'taro version change...'
    sudo npm install -g @tarojs/cli@$VERSION && npm run $script
fi


