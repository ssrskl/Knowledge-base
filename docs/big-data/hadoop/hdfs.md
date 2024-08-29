---
title: Hadoop之HDFS
sidebar_position: 2
tags: [大数据, Hadoop, HDFS]
---

# Hadoop 之 HDFS

## 用户/权限管理

HDFS（Hadoop 分布式文件系统）在用户和权限管理方面采用了一种相对简单的模型，类似于 Unix 文件系统。基本上跟 Linux 完全一样，就是用户，用户组，以及权限 r,w,x 那一套。又由于 HDFS 就是存储在 Linux 服务器上的，所以 HDFS 的权限管理也是基于 Linux 的权限管理。所以 HDFS 的用户就是操作系统的用户。

### 查看当前用户

在 HDFS 中，当前用户是运行命令的操作系统用户。你可以使用以下命令来查看当前操作系统用户：

```bash
whoami
```

### 查看所有用户

在大多数 Linux 系统上，所有用户的信息存储在 /etc/passwd 文件中。你可以使用以下命令查看该文件：

```bash
cat /etc/passwd
```

### 查看所有组

所有组的信息存储在 /etc/group 文件中。你可以使用以下命令查看该文件：

```bash
cat /etc/group
```

## 文件命令

### 查看文件列表

```bash
hdfs dfs -ls /path/to/directory
```

### 查看文件

普通查看文件

```bash
hdfs dfs -cat /path/to/file
```

查看 gz 压缩文件

```bash
hdfs dfs -cat /path/to/file.gz | zcat
```

### 创建目录

```bash
hdfs dfs -mkdir -p /path/to/directory
```

### 上传文件

```bash
hdfs dfs -put localfile /path/to/directory
```

### 下载文件

```bash
hdfs dfs -get /path/to/file localfile
```

### 删除文件

```bash
hdfs dfs -rm /path/to/file
```

### 删除目录

```bash
hdfs dfs -rm -r /path/to/directory
```
