---
title: 182.查找重复的电子邮箱
tags: [SQL, 习题, 重复]
---

## 题目描述

```text
表: Person

+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| email       | varchar |
+-------------+---------+
id 是该表的主键（具有唯一值的列）。
此表的每一行都包含一封电子邮件。电子邮件不包含大写字母。


编写解决方案来报告所有重复的电子邮件。 请注意，可以保证电子邮件字段不为 NULL。

以 任意顺序 返回结果表。

结果格式如下例。



示例 1:

输入:
Person 表:
+----+---------+
| id | email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+
输出:
+---------+
| Email   |
+---------+
| a@b.com |
+---------+
解释: a@b.com 出现了两次。
```

## 思考

:::tip
解决重复的问题，即<span style={{color:'red',fontWeight:'bold'}}>单表重复</span>的问题，我们可以使用**自连接去重**的方式来实现。

自连接的条件为主键不同，参数相同。
:::

## 题解

```sql
# Write your MySQL query statement below
# add all and as asc between by desc distance distinct from group if in join like limit left not null on or outer order select set to where
select distinct p1.email as Email
from Person as p1
inner join Person as p2
on p1.id != p2.id and p1.Email = p2.Email
```