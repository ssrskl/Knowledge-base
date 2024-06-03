---
title: Hive的使用
sidebar_position: 3
tags: [大数据, Hive]
---

# Hive 的使用
## 数据类型
### 原生数据类型

### 复杂数据类型

### 类型转换

## 加载数据
### 原始加载数据
原始的方式是通过`hadoop fs –put|-mv`等方式直接将数据移动到表文件夹下，例如：
```bash
hadoop fs -put /opt/module/datas/student.txt /user/hive/warehouse/student
```
### load加载数据
语法规则：
```sql
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)]

LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)] [INPUTFORMAT 'inputformat' SERDE 'serde'] (3.0 or later)
```
- LOCAL
1. 指定了LOCAL，将在本地的文件目录查找文件路径。
2. 没有指定LOCAL：将在HDFS中查找文件路径，即hadoop中的fs.default.name参数。

- OVERWRITE：目标表（或者分区）中的已经存在的数据会被删除

## 插入数据
本质上是使用MapReduce将数据写入到Hive表中的。
## 拉链表

## 题目练习

