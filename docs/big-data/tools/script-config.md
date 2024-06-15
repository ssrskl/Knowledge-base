---
title: 脚本配置
sidebar_position: 1
tags: [大数据, 工具]
---

## 脚本位置

:::tip
脚本可以放在全局变量中，例如`/bin`目录或者`/home/maoyan/bin`，即当前的用户的 bin 目录下，推荐放到`/bin`目录下，更方便。可以通过`env`命令来查看全局变量。
:::

## 常用脚本

### 集群统一执行命令脚本

xcall

```bash
#! /bin/bash
for i in hadoop101 hadoop102 hadoop103
do
    echo --------- $i ----------
    ssh $i $1
done
```

### 集群分发脚本

xsync

```bash
#!/bin/bash
# 判断参数的个数
if [ $# -lt 1  ];
then
  echo "Usage: $0 <file>"
    exit 1
fi
# 遍历所有的机器
for host in hadoop102 hadoop103 hadoop104
do
  echo ==================== $host ====================
  # 遍历所有的目录，挨个发送
  # shellcheck disable=SC2068
  for file in $@
  do
    # 判断文件是否存在
    if [ -e $file ]; then
      # 获取父目录
      pdir=$(cd -P $(dirname $file); pwd)
      # 获取当前文件的文件名
      fname=$(basename $file)
      # 在远程机器上创建目录
      ssh $host "mkdir -p $pdir"
      # 发送文件
      rsync -av $pdir/$fname $host:$pdir
    else
      echo "$file does not exist"
    fi
  done
done
```

### Hadoop 启停脚本
伪集群版：hdfs.sh
```bash
#!/bin/bash
if [ $# -lt 1 ]
then
  echo "没有输入参数"
  exit ;
fi

case $1 in
"start")
  echo "==========启动hadoop集群=========="
  echo "启动HDFS"
  ssh hadoop101 "/opt/module/hadoop/sbin/start-dfs.sh"
  echo "启动YARN"
  ssh hadoop101 "/opt/module/hadoop/sbin/start-yarn.sh"
  ;;
"stop")
  echo "==========关闭hadoop集群=========="
  echo "关闭YARN"
  ssh hadoop101 "/opt/module/hadoop/sbin/stop-yarn.sh"
  echo "关闭HDFS"
  ssh hadoop101 "/opt/module/hadoop/sbin/stop-dfs.sh"
  ;;
*)
  echo "输入参数错误"
  ;;
esac
```
