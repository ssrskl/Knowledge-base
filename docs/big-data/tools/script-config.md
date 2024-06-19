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

### Hive 启停脚本

hs（HiveService.sh）.sh

```bash
#!/bin/bash

HIVE_LOG_DIR=$HIVE_HOME/logs

if [ ! -d $HIVE_LOG_DIR ]; then
    mkdir -p $HIVE_LOG_DIR
fi
# 检测Hadoop是否启动
function check_hadoop_status(){
  if jps | grep -q 'NameNode'; then
    return 1
  else
    return 0
  fi
}
# 检查进程是否运行正常，参数 1 为进程名，参数 2 为进程端口
function check_process() {
    pid=$(ps -ef 2>/dev/null | grep -v grep | grep -i $1 | awk '{print $2}')
    ppid=$(netstat -nltp 2>/dev/null | grep $2 | awk '{print $7}' | cut -d '/' -f 1)
    echo $pid
    [[ "$pid" =~ "$ppid" ]] && [ "$ppid" ] && return 0 || return 1
}

function hive_start() {
    metapid=$(check_process HiveMetastore 9083)
    cmd="nohup /opt/module/hive/bin/hive --service metastore >/opt/module/hive/logs/metastore.log 2>&1 &"
    [ -z "$metapid" ] && eval $cmd || echo "Metastore 服务已启动"

    server2pid=$(check_process HiveServer2 10000)
    cmd="nohup /opt/module/hive/bin/hive --service hiveserver2 >/opt/module/hive/logs/hiveServer2.log 2>&1 &"
    [ -z "$server2pid" ] && eval $cmd || echo "HiveServer2 服务已启动"
}

function hive_stop() {
    metapid=$(check_process HiveMetastore 9083)
    [ "$metapid" ] && kill $metapid || echo "Metastore 服务未启动"

    server2pid=$(check_process HiveServer2 10000)
    [ "$server2pid" ] && kill $server2pid || echo "HiveServer2 服务未启动"
}

case $1 in
    "start")
        hive_start
        ;;
    "stop")
        hive_stop
        ;;
    "restart")
        hive_stop
        sleep 2
        hive_start
        ;;
    "status")
        check_process HiveMetastore 9083 >/dev/null && echo "Metastore 服务运行正常" || echo "Metastore 服务运行异常"
        check_process HiveServer2 10000 >/dev/null && echo "HiveServer2 服务运行正常" || echo "HiveServer2 服务运行异常"
        ;;
    *)
        echo "参数异常!!!"
        echo "Usage: $(basename $0) start|stop|restart|status"
        ;;
esac
```
