---
title: Hadoop之HDFS
sidebar_position: 2
tags: [大数据, Hadoop, HDFS]
---

# Hadoop 之 HDFS
## 用户/权限管理
HDFS（Hadoop分布式文件系统）在用户和权限管理方面采用了一种相对简单的模型，类似于Unix文件系统。基本上跟Linux完全一样，就是用户，用户组，以及权限r,w,x那一套。又由于HDFS就是存储在Linux服务器上的，所以HDFS的权限管理也是基于Linux的权限管理。所以HDFS的用户就是操作系统的用户。

### 查看当前用户
在HDFS中，当前用户是运行命令的操作系统用户。你可以使用以下命令来查看当前操作系统用户：
```bash
whoami
```
### 查看所有用户
在大多数Linux系统上，所有用户的信息存储在 /etc/passwd 文件中。你可以使用以下命令查看该文件：

```bash
cat /etc/passwd
```
### 查看所有组
所有组的信息存储在 /etc/group 文件中。你可以使用以下命令查看该文件：

```bash
cat /etc/group
```