---
title: Kafka 安装
sidebar_position: 2
tags: [大数据, Kafka, 消息中间件]
---

## 安装 Kafka

[Kafka Download](https://kafka.apache.org/downloads)

编辑配置文件

```bash
vim server.properties
```

```properties
broker.id=0 # 集群中唯一标识
listeners=PLAINTEXT://:9092 # 监听的端口
advertised.listeners=PLAINTEXT://192.168.1.100:9092 # 对外的端口
log.dirs=/tmp/kafka-logs # 日志存放目录
zookeeper.connect=localhost:2181 # zookeeper 的地址
```

配置环境变量

```bash
export KAFKA_HOME=/opt/module/kafka
export PATH=$PATH:$KAFKA_HOME/bin
```

启动 Kafka

```bash
bin/kafka-server-start.sh config/server.properties
```

后台启动

```bash
bin/kafka-server-start.sh -daemon config/server.properties
```

关闭 Kafka

```bash
bin/kafka-server-stop.sh
```

## 安装 Kafka Eagle（EFAK）

[官方文档](https://docs.kafka-eagle.org/)

```properties
efak.zk.cluster.alias=cluster1
cluster1.zk.list=localhost:2181
efak.driver=org.sqlite.JDBC
efak.url=jdbc:sqlite:/opt/module/efak/db/ke.db
efak.username=root
efak.password=ar352878987
```

## 常用命令

### 启停 Kafka

```bash
# 前台启动
bin/kafka-server-start.sh config/server.properties
# 后台启动
bin/kafka-server-start.sh -daemon config/server.properties
# 停止
bin/kafka-server-stop.sh
```

### Topic

遇到的错误：--zookeeper 不再使用，而是使用--bootstrap-server，并且端口使用 9092，而并非 2181-->[https://stackoverflow.com/questions/69297020/exception-in-thread-main-joptsimple-unrecognizedoptionexception-zookeeper-is](https://stackoverflow.com/questions/69297020/exception-in-thread-main-joptsimple-unrecognizedoptionexception-zookeeper-is)

```bash
# 查看所有 Topic
bin/kafka-topics.sh --list --bootstrap-server localhost:9092
# 查看指定 Topic 的详细信息
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic <topic_name>
# 创建 Topic
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic <topic-name>  --partitions 1 --replication-factor 1
# 删除 Topic
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic <topic_name>
```

### 生产者

创建生产者

```bash
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic TestFirst
```

### 消费者

创建消费者

```bash
bin/kafka-console-consumer.sh    localhost:9092 --from-beginning --topic TestFirst
```

## 脚本

```bash
#!/bin/bash

if [ -z "$1" ]; then
    echo "错误: 没有输入操作类型 (start/stop/create/delete/describe/list/producer/consumer/status)"
    exit 1
fi

case $1 in
    "start")
        echo "启动 Kafka..."
        nohup /opt/module/kafka/bin/kafka-server-start.sh -daemon config/server.properties >/dev/null 2>&1 &
        ;;
    "stop")
        echo "停止 Kafka..."
        /opt/module/kafka/bin/kafka-server-stop.sh
        ;;
    "create")
        echo "创建 Topic..."
        /opt/module/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic $2 --partitions 1 --replication-factor 1
        ;;
    "delete")
        echo "删除 Topic..."
        /opt/module/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic $2
        ;;
    "describe")
        echo "查看 Topic 信息..."
        /opt/module/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic $2
        ;;
    "list")
        echo "查看所有 Topic..."
        /opt/module/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
        ;;
    "producer")
        echo "创建生产者..."
        /opt/module/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic $2
        ;;
    "consumer")
        echo "创建消费者..."
        /opt/module/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic $2
        ;;
    "status")
        echo "查看 Kafka 状态..."
        kafka_pid=$(ps -ef | grep kafka.Kafka | grep -v grep | awk '{print $2}')
        if [ -n "$kafka_pid" ]; then
            echo "Kafka 正在运行，进程 ID: $kafka_pid"
        else
            echo "Kafka 未运行"
        fi
        ;;
    *)
        echo "错误: 无效的操作类型"
        echo "Usage: $0 {start|stop|create|delete|describe|list|producer|consumer|status}"
        exit 1
        ;;
esac
```
